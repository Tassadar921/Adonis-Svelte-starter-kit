import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';

const EventStreamController = () => import('@adonisjs/transmit/controllers/event_stream_controller');
const SubscribeController = () => import('@adonisjs/transmit/controllers/subscribe_controller');
const UnsubscribeController = () => import('@adonisjs/transmit/controllers/unsubscribe_controller');

const HealthCheckController = () => import('#controllers/health_checks_controller');
const AuthController = () => import('#controllers/auth_controller');
const ProfileController = () => import('#controllers/profile_controller');
const FileController = () => import('#controllers/file_controller');
const BlockedUserController = () => import('#controllers/blocked_user_controller');
const FriendController = () => import('#controllers/friend_controller');
const NotificationController = () => import('#controllers/notification_controller');
const PendingFriendController = () => import('#controllers/pending_friend_controller');
const UserController = () => import('#controllers/user_controller');
const OauthController = () => import('#controllers/oauth_controller');

router.get('healthcheck', [HealthCheckController]);

router
    .group((): void => {
        router
            .group((): void => {
                // Classic authentication routes
                router.post('/', [AuthController, 'login']);

                // OAuth routes
                router
                    .group((): void => {
                        router.get('/', [OauthController, 'github']);
                        router.get('/callback', [OauthController, 'githubCallback']);
                    })
                    .prefix('github');
                router
                    .group((): void => {
                        router.get('/', [OauthController, 'discord']);
                        router.get('/callback', [OauthController, 'discordCallback']);
                    })
                    .prefix('discord');
                router
                    .group((): void => {
                        router.get('/', [OauthController, 'google']);
                        router.get('/callback', [OauthController, 'googleCallback']);
                    })
                    .prefix('google');
            })
            .prefix('auth');

        // Classic account creation routes
        router
            .group((): void => {
                router.post('/send-mail', [AuthController, 'sendAccountCreationEmail']);
                router.get('/confirm/:token', [AuthController, 'confirmAccountCreation']);
            })
            .prefix('account-creation');

        router
            .group((): void => {
                router.post('/send-mail', [ProfileController, 'sendResetPasswordEmail']);
                router.post('/confirm/:token', [ProfileController, 'resetPassword']);
            })
            .prefix('reset-password');

        router
            .group((): void => {
                router.get('/', (): { sessionTokenIsValid: boolean } => {
                    return { sessionTokenIsValid: true };
                });

                router.get('/logout', [AuthController, 'logout']);

                router
                    .group((): void => {
                        router.get('/', [ProfileController, 'getProfile']);
                        router.post('/update', [ProfileController, 'updateProfile']);
                    })
                    .prefix('profile');

                router
                    .group((): void => {
                        router.get('/', [FriendController, 'search']);
                        router.get('/add', [UserController, 'searchNotFriends']);

                        router.post('/ask', [PendingFriendController, 'add']);
                        router.post('/accept', [FriendController, 'accept']);
                        router.post('/refuse', [FriendController, 'refuse']);
                        router
                            .group((): void => {
                                router.get('/', [PendingFriendController, 'search']);
                                router.delete('/cancel/:userId', [PendingFriendController, 'cancel']);
                            })
                            .prefix('pending');
                        router.delete('/remove/:userId', [FriendController, 'remove']);
                    })
                    .prefix('friends');

                router
                    .group((): void => {
                        router.get('/', [BlockedUserController, 'search']);
                        router.get('/add/:userId', [BlockedUserController, 'block']);
                        router.delete('/cancel/:userId', [BlockedUserController, 'cancel']);
                    })
                    .prefix('blocked');

                router
                    .group((): void => {
                        router.get('/pending-friends', [NotificationController, 'getPendingFriends']);
                    })
                    .prefix('notifications');
            })
            .use([middleware.auth({ guards: ['api'] })]);

        router
            .group((): void => {
                router.get('/profile-picture/:userId', [FileController, 'serveStaticProfilePictureFile']);
            })
            .prefix('static')
            .use([middleware.queryStringAuth()]);
    })
    .prefix('api')
    .use([middleware.log(), middleware.language()]);

router.get('/__transmit/events', [EventStreamController]);
router.post('/__transmit/subscribe', [SubscribeController]);
router.post('/__transmit/unsubscribe', [UnsubscribeController]);
