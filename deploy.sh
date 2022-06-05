highlight='\033[0;31m'
NC='\033[0m'
echo "${highlight}---------------------------------------------${NC}"

image_name=127.0.0.1:5000/staticblog:v1
container_name=staticblog
echo delete old container
docker rm -f ${container_name}
echo delete old image
docker rmi $image_name

docker rmi --force $image_name
echo building docker image...
docker build . -t $image_name --no-cache
echo running docker image...
docker run -d -t -p 8088:3000 --name=$container_name --restart=always $image_name

exit 0;