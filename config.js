exports.settings = {
    db: process.env.MONGOHQ_URL || 'mongodb://localhost/roll',
    from: 'noreply@rollout.com',
    emails: ['libtuck@gmail.com', 'rachel@gatorsdontbark.com', 'laras126@gmail.com', 'seye.ojumu@gmail.com'],
    email: {
    	libby: 'libtuck@gmail.com',
    	rachel: 'rachel@gatorsdontbark.com',
    	lara: 'laras126@gmail.com',
    	seye: 'seye.ojumu@gmail.com'
    }
}
