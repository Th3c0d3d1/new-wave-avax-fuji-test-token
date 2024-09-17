// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {
    // state variables
    string public name;
    string public symbol;
    uint public decimals = 18;
    uint public totalSupply;

    // balances
    mapping(address => uint256) public balanceOf;

    // token allowance
    mapping(address => mapping(address => uint256)) public allowance;

    // create events
    event Transfer(
        address indexed from,
        address indexed to,
        uint value
    );

    event Approval(
        address indexed owner,
        address indexed spender,
        uint value
    );

    // pass local variables(args) into state variables
    constructor(
        string memory _name,
        string memory _symbol,
        uint _totalSupply
    ){
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimals);

        balanceOf[msg.sender] = totalSupply;
    }

    // event functions
    function transfer(address _to, uint _value)
        public
        returns(bool success)
    {
        // verify sufficient balance
        require(balanceOf[msg.sender] >= _value, 'Not enough tokens');

        _transfer(msg.sender, _to, _value);

        return true;
    }

    function _transfer(
        address _from,
        address _to,
        uint _value
    ) internal {
        // make sure the address is a valid address & has enough quantity
        require(balanceOf[_from] >= _value, 'Not enough tokens');
        require(_to != address(0));

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        // emit transfer event
        emit Transfer(_from, _to, _value);
    }

    function approve(address _spender, uint _value)
        public
        returns(bool success)
    {
        require(_spender != address(0));

        allowance[msg.sender][_spender] = _value;

        // emit approval event
        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(
        address _from,
        address  _to,
        uint _value
        )
        public
        returns(bool success)
    {
        require(_value <= balanceOf[_from], 'Not enough tokens');
        require(_value <= allowance[_from][msg.sender], 'Token allowance exceeded');

        // reset the token alowance after transfer
        allowance[_from][msg.sender] = allowance[_from][msg.sender] - _value;

        // spend tokens on owners behalf
        _transfer(_from, _to, _value);

        return true;
    }
}
