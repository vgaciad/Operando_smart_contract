"use strict";

function Actions(props) {

    const [depositVal, setDepositVal] = React.useState("0");
    const [withdrawVal, setWithdrawVal] = React.useState("0");

    async function deposit(e) {

        const wallet = props.wallet;

        await BANK.methods.deposit().send({
            from: wallet,
            value: web3.utils.toWei(depositVal, 'ether')
        });

        setDepositVal("0");
        props.refresh(wallet);
    }

    async function withdraw(e) {

        const wallet = props.wallet;

        await BANK.methods.withdraw(web3.utils.toWei(withdrawVal, 'ether')).send({
            from: wallet
        });

        setWithdrawVal("0");
        props.refresh(wallet);
    }

    return (
        <div>

            <div>
                <h2>Deposit Process</h2>
                <input type="number" value={depositVal}
                    onChange={e => setDepositVal(e.target.value)} />
                <button onClick={deposit}> Deposit </button>
            </div>

            <div>
                <h2>Withdraw Process</h2>
                <input type="number" value={withdrawVal}
                    onChange={e => setWithdrawVal(e.target.value)} />
                <button onClick={withdraw}> Withdraw </button>
            </div>

        </div>
    );
}

function Main(props) {

    const [wallet, setWallet] = React.useState("");
    const [ethBalance, setEthBalance] = React.useState("");
    const [bankBalance, setBankBalance] = React.useState("");

    async function refreshBalances(wallet) {

        const balanceVal = await web3.eth.getBalance(wallet);
        setEthBalance(web3.utils.fromWei(balanceVal, 'ether'));

        const bankBalanceVal = await BANK.methods.getBalance(wallet).call();
        setBankBalance(web3.utils.fromWei(bankBalanceVal, 'ether'));
    }

    async function connectToMetamask(e) {

        try {


            const savedWallet = localStorage.getItem("Web3Login");

            if (savedWallet) {

                setWallet(savedWallet);
                await refreshBalances(wallet);
            }
        } catch (error) {

        }

        const wallets = await METAMASK.request({
            method: 'eth_requestAccounts'
        });

        await METAMASK.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORK]
        });

        const wallet = wallets.length > 0 ? wallets[0] : null;
        setWallet(wallet);

        localStorage.setItem("Web3Login", wallet);

        await refreshBalances(wallet);
    }

    return (
        <div>

            <img src="https://keepcoding.io/wp-content/uploads/2022/01/cropped-logo-keepcoding-Tech-School.png"></img>
            <h1>Welcome to Keepcoding Bank</h1>

            {
                wallet
                    ?
                    <section>
                        <p><b>Wallet</b> = {wallet}</p>
                        <p><b>Wallet Balance</b> = {ethBalance} ETH</p>
                        <p><b>Bank Balance</b> = {bankBalance} ETH</p>
                        <Actions wallet={wallet} refresh={refreshBalances} />
                    </section>
                    :
                    <section>
                        <p>Welcome to your bank! It is time to connect your wallet.</p>
                        <button onClick={connectToMetamask}> Connect to Metamask </button>
                    </section>

            }

        </div>
    );
}