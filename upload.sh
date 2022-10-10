#!/bin/bash

# 各类配置信息
remote_download_path="public/uploads/"  # 下载默认的路径
remote_upload_path="uploads/" # 上传默认的路径
base_url="http://serial.limiaomiao.site:8089/" # 对象存储绑定的域名
upload_url="http://serial.limiaomiao.site:8089/"
# base_url="http://localhost:3000/" # 对象存储绑定的域名
# upload_url="http://localhost:3000/"
# 上传图片
for i in "$@"; do
    echo 'file=@'"${i}"
    curl -s --location --request POST "$upload_url""$remote_upload_path" \
        --header 'Content-Type: multipart/form-data' \
        --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4ifQ.AE2jPLoZsdDua3I1FfxDMCRD8KefPRLc9dcVoscmS9E' \
        -F 'file=@'"${i}"
done

# 输出结果
echo "Upload Success:"
for file in "$@"; do
    IFS='/' read -r -a array <<< "$file"
    id="${#array[@]}"
    echo "$base_url""$remote_download_path""${array[$id-1]}"
done
