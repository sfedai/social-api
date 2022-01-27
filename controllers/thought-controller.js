const { Thought, User } = require('../models');
const { populate } = require('../models/User');
//Endpoint: /api/thoughts
const thoughtController = {
	// get all thoughts
	getThoughts(req, res) {
		// TODO:DONE Your code here
		Thought.find()
			.select('-__v')
			.then((dbUserData) => {
				res.json(dbUserData);
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json(err);
			});
	},

	// get single thought by id
	getSingleThought(req, res) {
		// TODO: Done Your code
		Thought.findOne({ _id: req.params.thoughtId })
			.select('-__v')
			.populate('reactions')
			.then(
				(thought) =>
					!thought ? res.status(404).json({ message: 'No thought with that ID' }) : res.json(thought)
			)
			.catch((err) => res.status(500).json(err));
	},

	// create a thought
	createThought(req, res) {
		// TODO: DONE create a thought and add the thought to user's thoughts array ??

		Thought.create(req.body)
			.then((thought) => {
				return User.findOneAndUpdate(
					{ username: req.body.username },
					{ $addToSet: { thoughts: thought._id } },
					{ new: true }
				);
			})
			.then(
				(user) =>
					!user
						? res.status(404).json({ message: 'Thought created, but found no user with that ID' })
						: res.json('Created the thought')
			)
			.catch((err) => {
				console.log(err);
				res.status(500).json(err);
			});
	},

	// update thought
	updateThought(req, res) {
		// TODO: Done update thought
		Thought.findOneAndUpdate(
			{ _id: req.params.thoughtId },
			{
				$set: req.body
			},
			{
				runValidators: true, //?
				new: true
			}
		)
			.then((dbUserData) => {
				if (!dbUserData) {
					return res.status(404).json({ message: 'No thought with this id!' });
				}
				res.json(dbUserData);
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json(err);
			});
	},

	// delete thought
	deleteThought(req, res) {
		Thought.findOneAndRemove({ _id: req.params.thoughtId })
			.then((dbThoughtData) => {
				if (!dbThoughtData) {
					return res.status(404).json({ message: 'No thought with this id!' });
				}

				// remove thought id from user's `thoughts` field
				return User.findOneAndUpdate(
					{ thoughts: req.params.thoughtId },
					{ $pull: { thoughts: req.params.thoughtId } },
					{ new: true }
				);
			})
			.then((dbUserData) => {
				if (!dbUserData) {
					return res.status(404).json({ message: 'Thought created but no user with this id!' });
				}
				res.json({ message: 'Thought successfully deleted!' });
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json(err);
			});
	},

	// add a reaction to a thought
	addReaction(req, res) {
		//  TODO: Done add reaction to thought's reaction array
		Thought.findOneAndUpdate(
			{ _id: req.params.thoughtId },
			{ $addToSet: { reactions: req.body } },
			{ new: true }
		)
			.then((dbUserData) =>
					!dbUserData
						? res.status(404).json({ message: 'Reaction created, but no thought with this id!' })
						: res.json('Created the reaction')
			)
			.catch((err) => {
				console.log(err);
				res.status(500).json(err);
			});
	},

	// remove reaction from a thought
	removeReaction(req, res) {
		// TODO: Done remove reaction from thoughts
		Thought.findOneAndUpdate(
			{ _id: req.params.thoughtId },
			{ $pull: { reactions: { reactionId: req.params.reactionId }}},
			{ new: true }
		)
			.then((dbUserData) => {
				if (!dbUserData) {
					return res.status(404).json({ message: 'No thought/reaction with this id!' });
				}
				res.json(dbUserData);
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json(err);
			});
	}
};

module.exports = thoughtController;
