package main

import (
	"context"
	"crypto/ecdsa"
	"fmt"
	"log"
	"math"
	"math/big"
	"os"
	"time"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/spf13/pflag"
	"golang.org/x/crypto/sha3"
)

// ReadBlock reads block data indicated by block number.
func ReadBlock(client *ethclient.Client, blocknum int64) error {
	var block *types.Block
	if blocknum == -1 {
		var err error
		if block, err = client.BlockByNumber(context.Background(), nil); err != nil {
			return err
		}
	} else {
		var err error
		if block, err = client.BlockByNumber(context.Background(), big.NewInt(blocknum)); err != nil {
			return err
		}
	}
	log.Printf("block number: %v\n", block.Number().Uint64())
	log.Printf("block created: %v\n", time.Unix(int64(block.Time()), 0))
	log.Printf("block.difficulty: %v\n", block.Difficulty().Uint64())
	log.Printf("block has: %v\n", block.Hash().Hex())
	tcnt, _ := client.TransactionCount(context.Background(), block.Hash())
	log.Printf("num of trans: %v\n", tcnt) // It doesn't seem to work. why?
	log.Printf("num of trans: %v\n", len(block.Transactions()))
	ReadTransactions(client, block)
	return nil
}

// Read Transactions
func ReadTransactions(client *ethclient.Client, block *types.Block) {
	chainid, _ := client.NetworkID(context.Background())
	for i, tx := range block.Transactions() {
		// EIP155Signer implements Signer using the EIP-155 rules. This accepts transactions which
		// are replay-protected as well as unprotected homestead transactions.
		signer := types.NewEIP155Signer(chainid)
		if msg, err := tx.AsMessage(signer, nil); err == nil {
			log.Println(msg.From().Hex()) // 0x0fD081e3Bb178dc45c0cb23202069ddA57064258
		}

		log.Println("tx", i)
		log.Println("tx.Hash", tx.Hash().Hex())
		log.Println("tx.Value", tx.Value().String())
		log.Println("tx.Gas", tx.Gas())
		log.Println("tx.GasPrice", tx.GasPrice().Uint64())
		log.Println("tx.Nonce", tx.Nonce())
		log.Println("tx.Data", tx.Data())
		log.Println("tx.To", tx.To())
	}
}

func GetNetworkID(client *ethclient.Client) {
	chainID, err := client.NetworkID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	log.Println("chainID", chainID)
}

func WeiToEther(wei *big.Int) *big.Float {
	fbalance := new(big.Float)
	fbalance.SetString(wei.String())
	ethValue := new(big.Float).Quo(fbalance, big.NewFloat(math.Pow10(18)))
	// fmt.Println(ethValue) // 25.729324269165216041
	return ethValue
}

func GetTransaction(client *ethclient.Client, txhash string) {
	txHash := common.HexToHash(txhash) // "0x5d49fcaa394c97ec8a9c3e7bd9e8388d420fb050a52083ca52ff24b3b65bc9c2"
	tx, isPending, err := client.TransactionByHash(context.Background(), txHash)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("tx.hash", txHash)
	log.Println("tx.isPending", isPending)
	log.Println("tx.Hash", tx.Hash().Hex())
	log.Println("tx.Value", tx.Value().String())
	log.Println("tx.Value(ether)", WeiToEther(tx.Value()))

	log.Println("tx.Gas", tx.Gas())
	log.Println("tx.GasPrice", tx.GasPrice().Uint64())
	log.Println("tx.Nonce", tx.Nonce())
	log.Println("tx.Data", tx.Data())
	log.Println("tx.To", tx.To())

	chainid, _ := client.NetworkID(context.Background())
	// EIP155Signer implements Signer using the EIP-155 rules. This accepts transactions which
	// are replay-protected as well as unprotected homestead transactions.
	// ???
	signer := types.NewEIP155Signer(chainid)
	msg, err := tx.AsMessage(signer, nil)
	if err != nil {
		log.Println(err)
	}
	log.Println("tx.From", msg.From().Hex()) // 0x0fD081e3Bb178dc45c0cb23202069ddA57064258
}

// The transaction consists of the amount of ether you're transferring,
// the gas limit, the gas price, a nonce, the receiving address,
// and optionally data. The transaction must be signed with
// the private key of the sender before it's broadcasted to the network.
func SendCoin(client *ethclient.Client, edcsaPrivateKey string, toAddr string, wei int64) {
	privateKey, err := crypto.HexToECDSA(edcsaPrivateKey)
	if err != nil {
		log.Fatal(err)
	}
	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		log.Fatal("cannot assert type: publicKey is not of type *ecdsa.PublicKey")
	}

	fromAddress := crypto.PubkeyToAddress(*publicKeyECDSA)
	// Add nonce using a helper to get current nonce value.
	// PendingNonceAt that will return the next nonce you should use.
	nonce, err := client.PendingNonceAt(context.Background(), fromAddress)
	if err != nil {
		log.Fatal(err)
	}
	// value := big.NewInt(1000000000000000000) // in wei (1 eth)
	value := big.NewInt(wei)  // in wei (1 eth)
	gasLimit := uint64(21000) // in units

	// gasPrice := big.NewInt(30000000000)      // in wei (30 gwei)
	gasPrice, err := client.SuggestGasPrice(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	toAddress := common.HexToAddress(toAddr)

	// build an unsigned tx
	tx := types.NewTransaction(nonce, toAddress, value, gasLimit, gasPrice, nil)

	// The next step is to sign the transaction with the private key of the sender.
	chainID, err := client.NetworkID(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	signedTx, err := types.SignTx(tx, types.NewEIP155Signer(chainID), privateKey)
	if err != nil {
		log.Fatal(err)
	}
	// Now we are finally ready to broadcast the transaction to the entire network
	// by calling SendTransaction on the client which takes in the signed transaction.
	err = client.SendTransaction(context.Background(), signedTx)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("tx sent: %s", signedTx.Hash())
}

// Trnasfer ERC-20 Tokens
func SendToken(client *ethclient.Client, edcsaPrivateKey string, toAddr string) {
	// value must be 0. ETH를 보내는 것이 아님
	// data must be used.
	// tx := types.NewTransaction(nonce, toAddress, value, gasLimit, gasPrice, data)

	// Contract address
	tokenAddress := common.HexToAddress("0x28b149020d2152179873ec60bed6bf7cd705775d")

	privateKey, err := crypto.HexToECDSA(edcsaPrivateKey)
	if err != nil {
		log.Fatal(err)
	}
	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		log.Fatal("cannot assert type: publicKey is not of type *ecdsa.PublicKey")
	}

	fromAddress := crypto.PubkeyToAddress(*publicKeyECDSA)
	// Add nonce using a helper to get current nonce value.
	// PendingNonceAt that will return the next nonce you should use.
	nonce, err := client.PendingNonceAt(context.Background(), fromAddress)
	if err != nil {
		log.Fatal(err)
	}

	value := big.NewInt(0)                   // ETH = 0
	toAddress := common.HexToAddress(toAddr) // receiver

	// Contract 수행을 위해 contract 내 함수 signature 필요
	// 사용함수의 signature 생성; function transfer(address to, uint256 amount) external returns (bool);
	transferFnSignature := []byte("transfer(address,uint256)")
	hash := sha3.NewLegacyKeccak256()
	hash.Write(transferFnSignature)
	methodID := hash.Sum(nil)[:4]
	fmt.Println(hexutil.Encode(methodID))

	// Left zero padding of the to account e.g. 0x0000000000000000000000004592d8f8d7b001e72cb26a73e4fa1806a51ac79d
	paddedAddress := common.LeftPadBytes(toAddress.Bytes(), 32)

	amount := new(big.Int)
	amount.SetString("1000000000000000000000", 10) // sets the value to 1000 tokens, in the token denomination
	paddedAmount := common.LeftPadBytes(amount.Bytes(), 32)
	fmt.Println(hexutil.Encode(paddedAmount)) // 0x00000000000000000000000000000000000000000000003635c9adc5dea00000

	var data []byte
	data = append(data, methodID...)
	data = append(data, paddedAddress...)
	data = append(data, paddedAmount...)

	gasLimit, err := client.EstimateGas(context.Background(), ethereum.CallMsg{
		To:   &tokenAddress,
		Data: data,
	})
	if err != nil {
		log.Fatal(err)
	}

	gasPrice, err := client.SuggestGasPrice(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	tx := types.NewTransaction(nonce, tokenAddress, value, gasLimit, gasPrice, data)
	chainID, err := client.NetworkID(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	signedTx, err := types.SignTx(tx, types.NewEIP155Signer(chainID), privateKey)
	if err != nil {
		log.Fatal(err)
	}

	err = client.SendTransaction(context.Background(), signedTx)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("tx sent: %s", signedTx.Hash().Hex()) // tx sent: 0xa56316b637a94c4cc0331c73ef26389d6c097506d581073f927275e7a6ece0bc
}

var (
	help   = pflag.BoolP("help", "h", false, "help info")
	url    = pflag.StringP("uri", "u", "", "ethereum network uri to connect")
	txhash = pflag.String("txhash", "", "transaction hash")
	prikey = pflag.String("prikey", "", "private key hex string")
	to     = pflag.String("to", "", "receiver")
	wei    = pflag.Int64("wei", 0, "wei to send")

	// startupFile   = pflag.String("startup", "", "startup data formatted to ietf-json or yaml")
	// startupFormat = pflag.String("startup-format", "json", "startup data format [xml, json, yaml]")

	// yangfiles     = pflag.StringArrayP("files", "f", []string{}, "yang files to load")
	// dir           = pflag.StringArrayP("dir", "d", []string{}, "directories to search yang includes and imports")
	// excludes      = pflag.StringArrayP("exclude", "e", []string{}, "yang modules to be excluded from path generation")
)

func main() {
	pflag.Parse()
	if *help {
		// fmt.Fprintln(os.Stderr, "")
		pflag.PrintDefaults()
		os.Exit(1)
	}

	client, err := ethclient.Dial(*url)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()

	if *wei > 0 {
		SendCoin(client, *prikey, *to, *wei)
		return
	}
	GetNetworkID(client)

	// ReadBlock(client, -1)
	// ReadBlock(client, 30341193)
	GetTransaction(client, *txhash)

	// My transaction: 0x15b093f28f6e4c552e1aee945e8b9607aa041ebb687181b04691268f0384d839
	// from: 0x5836187d93100836faf0478224ac8dd2c85776d7
	// to: 0x699c833a3af793ccb9af57a461a67b679da46db1
	// Value(Sent Ether): 0.000001 Ether

}
