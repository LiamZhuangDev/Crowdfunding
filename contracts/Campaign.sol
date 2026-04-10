// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Campaign {
    address public immutable creator;
    string public name;
    string public description;
    uint256 public immutable goal;
    uint256 public immutable deadline;

    // Pending -> Active -> Successful
    //                    \ Failed   
    enum State {
        Pending, // Created but not started yet
        Active,  // Accepting contributions
        Successful, // Goal reached
        Failed    // Deadline passed without reaching goal
    }

    State public state;
    uint256 public totalContributed;
    mapping(address => uint256) public contributions;

    modifier onlyCreator() {
        require(msg.sender == creator, "Only creator can call this function");
        _;
    }

    modifier inState(State expectedState) {
        require(state == expectedState, "Invalid state for this action");
        _;
    }

    modifier beforeDeadline() {
        require(block.timestamp < deadline, "Deadline has passed");
        _;
    }

    modifier afterDeadline() {
        require(block.timestamp >= deadline, "Deadline has not passed yet");
        _;
    }

    event StateChanged(State oldState, State newState);
    event ContributionReceived(address indexed contributor, uint256 amount);
    event fundsWithdrawn(address indexed creator, uint256 amount);
    event fundsRefunded(address indexed contributor, uint256 amount);

    constructor(address _creator, string memory _name, string memory _description, uint256 _goal, uint256 _deadline) {
        creator = _creator;
        name = _name;
        description = _description;
        goal = _goal;
        deadline = _deadline;
        state = State.Pending;
    }

    function startCampaign() external onlyCreator inState(State.Pending) beforeDeadline {
        state = State.Active;
        emit StateChanged(State.Pending, State.Active);
    }

    function contribute() external payable inState(State.Active) beforeDeadline {
        require(msg.value > 0, "Contribution must be greater than 0");
        contributions[msg.sender] += msg.value;
        totalContributed += msg.value;

        if (totalContributed >= goal) {
            state = State.Successful;
            emit StateChanged(State.Active, State.Successful);
        }

        emit ContributionReceived(msg.sender, msg.value);
    }

    function finalize() external onlyCreator afterDeadline inState(State.Active) {
        if (totalContributed >= goal) {
            state = State.Successful;
        } else {
            state = State.Failed;
        }
        emit StateChanged(State.Active, state);
    }

    function withdraw() external onlyCreator afterDeadline inState(State.Successful) {
        uint256 amount = address(this).balance;

        (bool success,) = payable(creator).call{value: amount}("");
        require(success, "Withdrawal failed");

        emit fundsWithdrawn(creator, amount);
    }

    // Pull over push pattern for refunds
    // Use CEI (Checks-Effects-Interactions) pattern to prevent reentrancy attacks
    function refund() external afterDeadline inState(State.Failed) {
        uint256 amount = contributions[msg.sender];
        require(amount > 0, "No contributions to refund");

        // Set contribution to 0 before transfer to prevent reentrancy attacks
        contributions[msg.sender] = 0;

        (bool success,) = msg.sender.call{value: amount}("");
        require(success, "Refund failed");

        emit fundsRefunded(msg.sender, amount);
    }
}