---
title: 高阶追剧流程-docker-compose
categories: [杂项]
tags: [docker, 高阶追剧流程]
toc: true
date: 2022/4/18
---

这篇文章为高阶追剧流程的 docker-compose 一键部署模板，有时间会加上注释和教程

<!-- more -->

```yml
version: "3"
services:
  qbittorrent:
    image: superng6/qbittorrentee:latest
    container_name: qbittorrent
    environment:
      - PUID=1026
      - PGID=100
      - TZ=Asia/Shanghai
      - WEBUIPORT=8080
    volumes:
      - /home/shancw/data/qbittorrent:/config
      - /home/shancw/data/media:/downloads
      - /home/shancw/media/av:/av
    network_mode: host
    # ports:
    #   - 6881:6881
    #   - 8080:8080
    restart: unless-stopped
  emby:
    image: emby/embyserver
    container_name: embyserver
    environment:
      - UID=0 # The UID to run emby as (default: 2)
      - GID=0 # The GID to run emby as (default 2)
      - GIDLIST=100 # A comma-separated list of additional GIDs to run emby as (default: 2)
      - TZ=Asia/Shanghai
      - HTTP_PROXY=http://127.0.0.1:7890
      - All_PROXY=http://127.0.0.1:7890
      - NO_PROXY=172.17.0.1,127.0.0.1,localhost
    volumes:
      - /home/shancw/data/emby:/config # Configuration directory
      - /home/shancw/data/media/tv:/tv # tv directory
      - /home/shancw/data/media/movie:/movie # movie directory
      - /home/shancw/media/av:/av
    ports:
      - 8096:8096 # HTTP port
    devices:
      - /dev/dri:/dev/dri # VAAPI/NVDEC/NVENC render nodes
    restart: unless-stopped
  jackett:
    image: linuxserver/jackett:latest
    container_name: jackett
    environment:
      - PUID=0
      - PGID=0
      - TZ=Asia/Shanghai
    volumes:
      - /home/shancw/data/jackett:/config
    ports:
      - 9117:9117
    restart: unless-stopped
  sonarr:
    image: linuxserver/sonarr:latest
    container_name: sonarr
    environment:
      - PUID=0
      - PGID=0
      - TZ=Asia/Shanghai
    volumes:
      - /home/shancw/data/sonarr:/config
      - /home/shancw/data/media/tv:/tv
      - /home/shancw/data/media:/downloads
    ports:
      - 8989:8989
    restart: unless-stopped
  radarr:
    image: linuxserver/radarr:latest
    container_name: radarr
    environment:
      - PUID=0
      - PGID=0
      - TZ=Asia/Shanghai
    volumes:
      - /home/shancw/data/radarr:/config
      - /home/shancw/data/media/tv:/tv
      - /home/shancw/data/media:/downloads
    ports:
      - 7878:7878
    restart: unless-stopped
  bazarr:
    image: lscr.io/linuxserver/bazarr
    container_name: bazarr
    environment:
      - PUID=0
      - PGID=0
      - TZ=Asia/Shanghai
    volumes:
      - /home/shancw/data/bazzar:/config
      - /home/shancw/data/media/movie:/movies #optional
      - /home/shancw/data/media/tv:/tv #optional
      - /home/shancw/media:/av # optional
    ports:
      - 6767:6767
    restart: unless-stopped
  chinesesubfinder:
    image: allanpk716/chinesesubfinder:v0.19.6
    volumes:
      - /home/shancw/data/chinesesubfinder:/config
      - /home/shancw/data/chinesesubfinder/cache:/app/SubFixCache
      - /home/shancw/data/media:/media
    environment:
      - PUID=0
      - PGID=0
      - TZ=Asia/Shanghai
    ports:
      - 19035:19035
    restart: unless-stopped
```

TIPS: 补充两个老司机专用链接,支持种子下载和字幕

- https://www.sehuatang.org/
- https://www.javbus.com/
