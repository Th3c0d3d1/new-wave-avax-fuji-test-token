const {ethers} = require('hardhat')
const {expect} = require('chai')

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
  // Declare & store variables in the contract
  let token,
    accounts,
    deployer,
    receiver,
    exchange

  beforeEach(async () => {
    const Token =  await ethers.getContractFactory('Token')

    // Assigning variables to the state of the deployed contract
    token = await Token.deploy('New Wave', 'NWV', 1000000)

    // Get accounts form ethers
    accounts = await ethers.getSigners()
    deployer = accounts[0]
    receiver = accounts[1]
    exchange = accounts[2]
  })

  // Declare the variables
      const name = 'New Wave'
      const symbol = 'NWV'
      const decimals = '18'
      const totalSupply = tokens('1000000')

  // Deployment block
  describe('Deployment', () => {
    // Variable checks
    it('has correct name', async () => {
      expect(await token.name()).to.equal(name)
    })
    it('has correct symbol', async () => {
      expect(await token.symbol()).to.equal(symbol)
    })

    it('has correct decimals', async () => {
      expect(await token.decimals()).to.equal(decimals)
    })

    it('has correct total supply', async () => {
      expect(await token.totalSupply()).to.equal(totalSupply)
    })

    it('assigns total supply to deployer', async () => {
      expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
    })
  })

  // Transaction block
  describe('Sending token', () => {
    // Declare the variables
    let amount,
      transaction,
      result

    describe('Success', () => {
      beforeEach(async () => {
        amount = tokens(100)
        transaction = await token.connect(deployer).transfer(receiver.address, amount)
        result = await transaction.wait()
      })

      // Variable checks
      it('transfers token balances', async () => {
        expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
        expect(await token.balanceOf(receiver.address)).to.equal(amount)
      })

      it('emits Transfer event', async () => {
        // Declare the event to check
        const event = result.events[0]

        // Check the event for the transaction
        expect(event.event).to.equal('Transfer')

        const args = event.args

        // Check transaction arguments
        expect(args.from).to.equal(deployer.address)
        expect(args.to).to.equal(receiver.address)
        expect(args.value).to.equal(amount)
      })
    })

    describe('Failure', () => {
      it('rejects insufficient balances', async () => {
        // Declare invalid token amount variable
        const invalidAmount = tokens(100000000)

        // Revert transaction if test run correctly
        await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted
      })

      it('rejects invalid recipients', async () => {
        // declare amount of tokens to send invalid recipient
        const amount = tokens(100)

        // Revert transaction if test run correctly
        await expect(token.connect(deployer).transfer(ethers.constants.AddressZero, amount)).to.be.reverted
      })
    })
  })

  describe('Approving Tokens', () => {
    let amount,
      transaction,
      result

      beforeEach(async () => {
        amount = tokens(100)
        transaction = await token.connect(deployer).approve(exchange.address, amount)
        result = await transaction.wait()
      })

      describe('Success', () => {
        it('approves an allowance for delegated token spending', async () => {
          expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount)
        })

        it('emits Approval event', async () => {
          const event = result.events[0]
          expect(event.event).to.equal('Approval')

          const args = event.args
          expect(args.owner).to.equal(deployer.address)
          expect(args.spender).to.equal(exchange.address)
          expect(args.value).to.equal(amount)
        })
      })

      describe('Failure', () => {
        it('rejects invalid spenders', async () => {
          await expect(token.connect(deployer).approve(ethers.constants.AddressZero, amount)).to.be.reverted
        })
      })
  })

  describe('Delegated token transfers', () => {
    let amount,
      transaction,
      result

    beforeEach(async () => {
      amount = tokens(100)

      // Approve the exchange to spend the deployer's tokens
      transaction = await token.connect(deployer).approve(exchange.address, amount)
      result = await transaction.wait()
    })

    describe('Success', async () => {
      beforeEach(async () => {
        amount = tokens(100)

        transaction = await token.connect(exchange).transferFrom(deployer.address, receiver.address, amount)
        result = await transaction.wait()
      })

      it('transfers token balances', async () => {
        expect(await token.balanceOf(deployer.address)).to.be.equal(ethers.utils.parseUnits('999900', 'ether'))
        expect(await token.balanceOf(receiver.address)).to.be.equal(amount)
      })

      it('resets the allowance', async () => {
        expect (await token.allowance(deployer.address, exchange.address)).to.be.equal(0)
      })

      it('emits Transfer event', async () => {
        const event = result.events[0]

        expect(event.event).to.equal('Transfer')

        // Verify event arguments
        const args = event.args
        expect(args.from).to.equal(deployer.address)
        expect(args.to).to.equal(receiver.address)
        expect(args.value).to.equal(amount)
      })
    })

    describe('Failure', () => {
      it('rejects insufficient allowances', async () => {
        const invalidAmount = tokens(100000000)

        await expect(token.connect(exchange).transferFrom(deployer.address, receiver.address, invalidAmount)).to.be.reverted
      })
    })
  })
})
