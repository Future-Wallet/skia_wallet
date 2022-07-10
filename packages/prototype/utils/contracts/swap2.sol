   * @notice Atomic ERC20 Swap
   * @param nonce uint256 Unique and should be sequential
   * @param expiry uint256 Expiry in seconds since 1 January 1970
   * @param signerWallet address Wallet of the signer
   * @param signerToken address ERC20 token transferred from the signer
   * @param signerAmount uint256 Amount transferred from the signer
   * @param senderToken address ERC20 token transferred from the sender
   * @param senderAmount uint256 Amount transferred from the sender
   * @param v uint8 "v" value of the ECDSA signature
   * @param r bytes32 "r" value of the ECDSA signature
   * @param s bytes32 "s" value of the ECDSA signature
   */
  function swap(
    address recipient,
    uint256 nonce,
    uint256 expiry,
    address signerWallet,
    address signerToken,
    uint256 signerAmount,
    address senderToken,
    uint256 senderAmount,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) external override {
    // Ensure the order is valid
    _checkValidOrder(
      nonce,
      expiry,
      signerWallet,
      signerToken,
      signerAmount,
      senderToken,
      senderAmount,
      v,
      r,
      s
    );

    // Transfer token from sender to signer
    IERC20(senderToken).safeTransferFrom(
      msg.sender,
      signerWallet,
      senderAmount
    );

    // Transfer token from signer to recipient
    IERC20(signerToken).safeTransferFrom(signerWallet, recipient, signerAmount);

    // Calculate and transfer protocol fee and any rebate
    _transferProtocolFee(signerToken, signerWallet, signerAmount);

    // Emit a Swap event
    emit Swap(
      nonce,
      block.timestamp,
      signerWallet,
      signerToken,
      signerAmount,
      protocolFee,
      msg.sender,
      senderToken,
      senderAmount
    );
  }