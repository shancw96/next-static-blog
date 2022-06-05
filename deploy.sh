highlight='\033[0;31m'
NC='\033[0m'
echo "${highlight}---------------------------------------------${NC}"
cd next-static-blog
image_name=127.0.0.1:5000/staticblog:v1
container_name=staticblog
echo "${highlight}delete old container${NC}" 
docker rm -f ${container_name}
echo "${highlight}delete old image${NC}" 
docker rmi $image_name

docker rmi --force $image_name
echo "${highlight}building image...${NC}" 
docker build /home/shancw/project/next-static-blog/. -t $image_name --no-cache
echo "${highlight}running image...${NC}" 
docker run -d -t -p 8088:3000 --name=$container_name --restart=always $image_name

exit 0;