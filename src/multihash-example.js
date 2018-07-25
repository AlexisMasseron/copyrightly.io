submitListing(ipfsListing, ethPrice, units) {
  return new Promise((resolve, reject) => {
    this.listingContract.setProvider(window.web3.currentProvider)
    window.web3.eth.getAccounts((error, accounts) => {
      this.listingContract.deployed().then((instance) => {
        let weiToGive = window.web3.toWei(ethPrice, 'ether')
        return instance.create(
            this.getBytes32FromIpfsHash(ipfsListing), /*** IPFS here ***/
            weiToGive,
            units,
            {from: accounts[0]})
      }).then((result) => {
        resolve(result)
      }).catch((error) => {
        console.error("Error submitting to the Ethereum blockchain: " + error)
        reject(error)
      })
    })
  })
