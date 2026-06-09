# Aave V3 Mantle Reference

## Addresses (Mantle Mainnet 5000)
- **Pool**: `0x458F293454fE0d67EC0655f3672301301DD51422`
- **Pool Addresses Provider**: `0xba50Cd2A20f6DA35D788639E581bca8d0B5d4D5f`

## Common Functions

### supply
- **Description**: Deposit an asset into the protocol.
- **Prerequisite**: ERC20 `approve(pool, amount)`
- **Signature**: `supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)`
- **ABI**:
```json
{
  "inputs": [
    { "internalType": "address", "name": "asset", "type": "address" },
    { "internalType": "uint256", "name": "amount", "type": "uint256" },
    { "internalType": "address", "name": "onBehalfOf", "type": "address" },
    { "internalType": "uint16", "name": "referralCode", "type": "uint16" }
  ],
  "name": "supply",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}
```

### withdraw
- **Description**: Withdraw an asset from the protocol.
- **Signature**: `withdraw(address asset, uint256 amount, address to)`
- **ABI**:
```json
{
  "inputs": [
    { "internalType": "address", "name": "asset", "type": "address" },
    { "internalType": "uint256", "name": "amount", "type": "uint256" },
    { "internalType": "address", "name": "to", "type": "address" }
  ],
  "name": "withdraw",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "nonpayable",
  "type": "function"
}
```
