import { Stack, Button} from "@mui/material"
import CreateIcon from '@mui/icons-material/Create';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
// import SendIcon from '@mui/icons-material/Send';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import './App.css';

import { 
    clusterApiUrl, 
    Connection, 
    PublicKey, 
    Keypair,
    sendAndConfirmTransaction,
    LAMPORTS_PER_SOL,
    Transaction
} from '@solana/web3.js';
import { 
    createMint, 
    getOrCreateAssociatedTokenAccount, 
    mintTo, 
    Account, 
    createSetAuthorityInstruction, 
    AuthorityType
} from '@solana/spl-token';

window.Buffer = window.Buffer || require("buffer").Buffer;

function MintNft() {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    // Generate a new wallet keypair and airdrop SOL
    const fromWallet = Keypair.generate();
	let fromTokenAccount: Account; 
	let mint: PublicKey;

    async function createNft() {
        const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
        await connection.confirmTransaction(fromAirdropSignature);
    
        // Create new NFT mint
        mint = await createMint(
            connection, 
            fromWallet, 
            fromWallet.publicKey, 
            null, 
            0 // only allow whole tokens
        );
            
        console.log(`Create NFT: ${mint.toBase58()}`);
    
        // Get the NFT account of the fromWallet address, and if it does not exist, create it
        fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            mint,
            fromWallet.publicKey
        );

        console.log(`Create NFT Account: ${fromTokenAccount.address.toBase58()}`);
    }
    async function mintNft() {
        // Mint 1 new token to the "fromTokenAccount" account we just created
        const signature = await mintTo(
            connection,
            fromWallet,
            mint,
            fromTokenAccount.address,
            fromWallet.publicKey,
            1
        );
        console.log(`Mint signature: ${signature}`);
    }
    async function lockNft() {
        // Create our transaction to change minting permissions
        let transaction = new Transaction().add(createSetAuthorityInstruction(
            mint,
            fromWallet.publicKey,
            AuthorityType.MintTokens,
            null
        ));
      
        // Send transaction
        const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
        console.log(`Lock signature: ${signature}`);
    }

    return (
        <div>
            <p className="SecT">Mint NFT Section</p>
            <div className="SecNFT">
                <Stack spacing={2} direction='row'>
                    <Button sx={ { borderRadius: 8 } } variant='contained' endIcon={<CreateIcon />} onClick={createNft}>Create NFT</Button>
                    <Button sx={ { borderRadius: 8 } } variant='contained' endIcon={<RocketLaunchIcon />} onClick={mintNft}>Mint NFT</Button>
                    <Button sx={ { borderRadius: 8 } } variant='contained' endIcon={<AccountBalanceWalletIcon />} onClick={lockNft}>Lock NFT</Button>
                </Stack>
            </div>
        </div>
    );
}

export default MintNft;