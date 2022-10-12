import { Stack, Button, TextField} from "@mui/material"
import CreateIcon from '@mui/icons-material/Create';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SendIcon from '@mui/icons-material/Send';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import './App.css';

import { 
    clusterApiUrl, 
    Connection, 
    PublicKey, 
    Keypair, 
    LAMPORTS_PER_SOL 
} from '@solana/web3.js';
import { 
    createMint, 
    getOrCreateAssociatedTokenAccount, 
    mintTo, 
    transfer, 
    Account, 
    getMint, 
    getAccount
} from '@solana/spl-token';

window.Buffer = window.Buffer || require("buffer").Buffer;

function MintToken() {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const fromWallet = Keypair.generate();
    let mint: PublicKey;
    let fromTokenAccount: Account;
    const toWallet = new PublicKey('HTp6jWHpWwbDcVoJKVYT55J9H2pburTmz1XtSDojtZJ1');
    // const[receiver, setReceiver] = useState(new PublicKey('HTp6jWHpWwbDcVoJKVYT55J9H2pburTmz1XtSDojtZJ1'));

    async function createToken() {
        const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
        await connection.confirmTransaction(fromAirdropSignature);
    
        // Create new token mint
        mint = await createMint(
            connection, 
            fromWallet, 
            fromWallet.publicKey, 
            null, 
            9 // 9 here means we have a decmial of 9 0's
        );
        console.log(`Create token: ${mint.toBase58()}`);
       
    
        // Get the token account of the fromWallet address, and if it does not exist, create it
        fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            mint,
            fromWallet.publicKey
        );
        console.log(`Create Token Account: ${fromTokenAccount.address.toBase58()}`);
    }

    async function mintToken() {
        console.log(fromTokenAccount.address);
        const signature = await mintTo(
            connection,
            fromWallet,
            mint,
            fromTokenAccount.address,
            fromWallet.publicKey,
            10000000000
        );
        console.log(`Mint signature: ${signature}`);
    }

    async function checkBalance() {
        const mintInfo = await getMint(connection, mint);
        console.log(mintInfo.supply); 

        const tokenAccountInfo = await getAccount(connection, fromTokenAccount.address);
        console.log(tokenAccountInfo.amount);
    }

    async function sendToken() {
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, toWallet);
        console.log(`toTokenAccount ${toTokenAccount.address}`);

        const signature = await transfer(
            connection,
            fromWallet,
            fromTokenAccount.address,
            toTokenAccount.address,
            fromWallet.publicKey,
            1000000000
        );
        console.log(`finished transfer with ${signature}`);
    }    

    return (
        <div>
            {/* <p>{output}</p> */}
            <p className="SecT">Mint Token Section</p>
            <Stack spacing={2} direction='column'>
                <Button sx={ { borderRadius: 8 } } variant='contained' endIcon={<CreateIcon />} onClick={createToken}>Create token</Button>
                <Button sx={ { borderRadius: 8 } } variant='contained' endIcon={<RocketLaunchIcon />} onClick={mintToken}>Mint token</Button>
                <Button sx={ { borderRadius: 8 } } variant='contained' endIcon={<AccountBalanceWalletIcon />} onClick={checkBalance}>Check balance</Button>
                <TextField label= "Receiver's Address" 
                required 
                variant='filled'
                />
                <Button sx={ { borderRadius: 8 } } variant='contained' endIcon={<SendIcon />} onClick={sendToken}>Send token</Button>
            </Stack>
        </div>
    );
  }
  
  export default MintToken;