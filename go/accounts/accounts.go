package main

import (
	"context"
	"crypto/ecdsa"
	"flag"
	"io/ioutil"
	"log"
	"math"
	"math/big"
	"os"
	"regexp"

	"github.com/ethereum/go-ethereum/accounts/keystore"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/spf13/pflag"
	"golang.org/x/crypto/sha3"
)

func GetAccountAddress(any string) {
	address := common.HexToAddress(any)

	log.Println(address.Hex()) // 0x71C7656EC7ab88b098defB751B7401B5f6d8976F
	// Hash converts an address to a hash by left-padding it with zeros.
	log.Println(address.Hash().Hex()) // 0x00000000000000000000000071c7656ec7ab88b098defb751b7401b5f6d8976f
	log.Println(address.Bytes())      // [113 199 101 110 199 171 136 176 152 222 251 117 27 116 1 181 246 216 151 111]
}

func GetBalance(url, id string) {
	client, err := ethclient.Dial(url)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()

	account := common.HexToAddress(id)
	balance, err := client.BalanceAt(context.Background(), account, nil)
	if err != nil {
		log.Fatal(err)
	}
	log.Println(balance) // 25893180161173005034

	fb := new(big.Float)
	fb.SetString(balance.String())
	ether := new(big.Float).Quo(fb, big.NewFloat(math.Pow10(18)))
	log.Println(ether)

	// // My account's balance became updated at the transaction 30330079.
	// blockNumber := big.NewInt(30330079)
	// balanceAt, err := client.BalanceAt(context.Background(), account, blockNumber)
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// log.Println(balanceAt) // 0

	// fbalance := new(big.Float)
	// fbalance.SetString(balanceAt.String())
	// ethValue := new(big.Float).Quo(fbalance, big.NewFloat(math.Pow10(18)))
	// log.Println(ethValue) // 25.729324269165216041

	pendingBalance, err := client.PendingBalanceAt(context.Background(), account)
	if err != nil {
		log.Fatal(err)
	}
	log.Println(pendingBalance) // 25729324269165216042
}

// Generating New Wallet (Account)
// 생성된 priave key로 keystore에 private key를 저장하여 wallet 생성
func NewAccount() {
	// Private key의 seed를 rand.Reader가 아닌 고정값으로 할 경우
	// 동일한 private key를 구할 수 있다. metamask가 이러한 key generation을 제공
	// func GenerateKey() (*ecdsa.PrivateKey, error) {
	// 	return ecdsa.GenerateKey(S256(), rand.Reader)
	// }

	// GenerateKey generates a new private key.
	prikey, err := crypto.GenerateKey()
	if err != nil {
		log.Fatal(err)
	}
	// converts to bytes
	privateKeyBytes := crypto.FromECDSA(prikey)

	// private key bytes to hexstring
	// remove 0x prefix from bytestring
	privateKeyString := hexutil.Encode(privateKeyBytes)[2:]

	// public key
	pubkey := prikey.Public()
	var ok bool
	pubkeyECDSA, ok := pubkey.(*ecdsa.PublicKey)
	if !ok {
		log.Fatal("ecdsa public Key converting failed")
	}

	publicKeyBytes := crypto.FromECDSAPub(pubkeyECDSA)

	// strip off the 0x and the first 2 characters 04
	// which is always the EC prefix and is not required.
	publicKeyString := hexutil.Encode(publicKeyBytes)[4:]

	// must be address1  == address2
	address1 := crypto.PubkeyToAddress(*pubkeyECDSA).Hex()

	hash := sha3.NewLegacyKeccak256()
	// hashing without the EC prefix
	hash.Write(publicKeyBytes[1:])
	address2 := hexutil.Encode(hash.Sum(nil)[12:])

	log.Println("private key:", privateKeyString)
	log.Println("public key:", publicKeyString)
	log.Println(address1)
	log.Println(address2)
}

func ValidateAccount(accountAddress string) bool {
	re := regexp.MustCompile("^0x[0-9a-fA-F]{40}$")
	log.Println(accountAddress)
	// fmt.Printf("is valid: %v\n", re.MatchString(accountAddress))                               // is valid: true
	// fmt.Printf("is valid: %v\n", re.MatchString("0x323b5d4c32345ced77393b3530b1eed0f346429d")) // is valid: true
	// fmt.Printf("is valid: %v\n", re.MatchString("0xZYXb5d4c32345ced77393b3530b1eed0f346429d")) // is valid: false
	return re.MatchString(accountAddress)
}

func IsContractAccount(uri, accountAddress string) bool {
	client, err := ethclient.Dial(uri)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()
	// 0x Protocol Token (ZRX) smart contract address ...?
	addr := common.HexToAddress(accountAddress)
	bytecode, err := client.CodeAt(context.Background(), addr, nil) // nil is latest block
	if err != nil {
		log.Fatal(err)
	}
	isContract := len(bytecode) > 0
	return isContract
}

// keystore는 NewKeystore로 지정된 디렉터리안의 keystore 파일을 관리한다.
// keystore가 생성된 이후에는 다른 디렉터리의 keystore 파일을 가져오거나 내보낼 수 있다.
func CreateKeystore() {
	ks := keystore.NewKeyStore("../.wallets", keystore.StandardScryptN, keystore.StandardScryptP)
	password := "secret"
	account, err := ks.NewAccount(password)
	if err != nil {
		log.Fatal(err)
	}
	log.Println(account.Address)
	// log.Println(account.Address.Hex())
	// log.Println(account.URL.Path)
	// log.Println(account.URL.String())
}

func ImportKeystore(keystorefile string) {
	ks := keystore.NewKeyStore("../.wallets", keystore.StandardScryptN, keystore.StandardScryptP)
	jsonbytes, err := ioutil.ReadFile(keystorefile)
	if err != nil {
		log.Fatal(err)
	}
	password := "secret"
	account, err := ks.Import(jsonbytes, password, password)
	if err != nil {
		log.Fatal(err)
	}

	log.Println(account.Address.Hex())
	if err := os.Remove(keystorefile); err != nil {
		log.Fatal(err)
	}
}

var (
	help        = pflag.BoolP("help", "h", false, "help info")
	url         = pflag.StringP("uri", "u", "", "ethereum network uri to connect")
	accountAddr = pflag.StringP("account-address", "a", "", "account address")
	// startupFile   = pflag.String("startup", "", "startup data formatted to ietf-json or yaml")
	// startupFormat = pflag.String("startup-format", "json", "startup data format [xml, json, yaml]")

	// yangfiles     = pflag.StringArrayP("files", "f", []string{}, "yang files to load")
	// dir           = pflag.StringArrayP("dir", "d", []string{}, "directories to search yang includes and imports")
	// excludes      = pflag.StringArrayP("exclude", "e", []string{}, "yang modules to be excluded from path generation")
)

func main() {
	pflag.CommandLine.AddGoFlagSet(flag.CommandLine)
	pflag.Parse()
	if *help {
		pflag.CommandLine.Usage()
		pflag.PrintDefaults()
		return
	}

	// 0x5836187D93100836FaF0478224Ac8dD2C85776d7
	// https://kovan.infura.io/v3/f475934946b5469393962d48c58497ea
	if !ValidateAccount(*accountAddr) {
		log.Fatalf("invalid account address %s", *accountAddr)
	}
	log.Printf("is Contract? %v\n", IsContractAccount(*url, *accountAddr))
	GetAccountAddress(*accountAddr)
	GetBalance(*url, *accountAddr)
	NewAccount()
	// CreateKeystore()
	// ImportKeystore("../.wallets/UTC--2022-03-11T15-02-32.615230772Z--a2f76a1a11267070bb004b87c490dc82418b7851")
}
