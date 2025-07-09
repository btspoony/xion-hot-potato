# "Hot Potato" App

## How to run

Clone the repo

```bash
git clone --recurse-submodules https://github.com/btspoony/xion-hot-potato.git

# If you already have the repo, you can just do:
git submodule update --init --recursive
```

Install dependencies and build the app:

```bash
pnpm install
pnpm build
```

## Appendix

### Deployed contract

Using [cw721-base](https://github.com/public-awesome/cw-nfts/tree/main/contracts/cw721-base).

Deploying Txhash: `C875CB0E721A4044E68A059FF0231C385193847D32A61813E207C75B9B4B03D0`  
Contract's Code ID: `1382`

### Transactions

> InstantiateMsg

```bash
MSG='{ "name": "Hot Potato", "symbol": "HOTPOTATO" }'
```

Instantiating Txhash: `91E44438E9DB07C69DF52ACFC060133332199CFD2A83AF36A674E29EAA0BEF3E`  
Contract address: `xion1l40eqwd2fn834pgfhryc7ugu5t6qr99tuwm55ad8dllhx0zhfsmq8u6nja`
