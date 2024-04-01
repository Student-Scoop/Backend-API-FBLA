import { Router } from 'express';
import { validate } from '@/middleware/validation/validate';
import RelationshipController from '@/controllers/relationship';

import {
	followerFollowingValidator,
	followValidator,
	unfollowValidator,
	searchValidator
} from '../../../middleware/validation/rules';

const relationshipRouter = Router();

relationshipRouter.post(
	'/follow',
	followValidator,
	validate,
	RelationshipController.follow
);

relationshipRouter.post('/unfollow', unfollowValidator, validate, RelationshipController.unfollow);

relationshipRouter.get(
	'/followers',
	followerFollowingValidator,
	validate,
	RelationshipController.getFollowers
);

relationshipRouter.get(
	'/following',
	followerFollowingValidator,
	validate,
	RelationshipController.getFollowing
);

relationshipRouter.get(
	'/search',
	searchValidator,
	validate,
	RelationshipController.searchUser
);

export default relationshipRouter;
