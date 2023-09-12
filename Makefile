deploy:
	# npm run build
	rsync -avz --delete dist/ root@116.203.225.81:/opt/RadicalVPN/Frontend