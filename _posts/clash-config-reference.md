---
title: 【转载】clash 配置记录
categories: []
tags: []
toc: true
date: 2022/3/18
---

[joylau: Clash 基本配置记录](http://blog.joylau.cn/2020/05/01/Clash-Config/)

<!-- more -->

```yaml
---
#---------------------------------------------------#
## 配置文件需要放置在 $HOME/.config/clash/config.yml
##
## 如果您不知道如何操作，请参阅 SS-Rule-Snippet 的 Wiki：
## https://github.com/Hackl0us/SS-Rule-Snippet/wiki/clash(X)
#---------------------------------------------------#

# HTTP 代理端口
port: 7890

# SOCKS5 代理端口
socks-port: 7891

# Linux 和 macOS 的 redir 代理端口 (如需使用此功能，请取消注释)
# redir-port: 7892

# 允许局域网的连接（可用来共享代理）
allow-lan: false
# bind-address: "*"
# 此功能仅在 allow-lan 设置为 true 时生效，支持三种参数：
# "*"                           绑定所有的 IP 地址
# 192.168.122.11                绑定一个的 IPv4 地址
# "[aaaa::a8aa:ff:fe09:57d8]"   绑定一个 IPv6 地址

# 规则模式：Rule（规则） / Global（全局代理）/ Direct（全局直连）
mode: Rule

# 设置日志输出级别 (默认级别：silent，即不输出任何内容，以避免因日志内容过大而导致程序内存溢出）。
# 5 个级别：silent / info / warning / error / debug。级别越高日志输出量越大，越倾向于调试，若需要请自行开启。
log-level: silent

# clash 的 RESTful API
external-controller: 127.0.0.1:9090

# 您可以将静态网页资源（如 clash-dashboard）放置在一个目录中，clash 将会服务于 `${API}/ui`
# 参数应填写配置目录的相对路径或绝对路径。
# external-ui: folder

# RESTful API 的口令 (可选)
# secret: ""

# 实验性功能
experimental:
  ignore-resolve-fail: true # 忽略 DNS 解析失败，默认值为 true

# 本地 SOCKS5 / HTTP(S) 服务认证
# authentication:
#  - "user1:pass1"
#  - "user2:pass2"

# # 实验性功能 hosts, 支持通配符 (例如 *.clash.dev 甚至 *.foo.*.example.com)
# # 静态的域名 比 通配域名 具有更高的优先级 (foo.example.com 优先于 *.example.com)
# # 注意: hosts 在 fake-ip 模式下不生效
# hosts:
#   '*.clash.dev': 127.0.0.1
#   'alpha.clash.dev': '::1'

dns:
  enable: true
  ipv6: false
  # listen: 0.0.0.0:53
  # enhanced-mode: redir-host # 或 fake-ip
  # # fake-ip-range: 198.18.0.1/16 # 如果你不知道这个参数的作用，请勿修改
  # fake-ip-filter: # fake-ip 白名单列表
  #   - '*.lan'
  #   - localhost.ptlogin2.qq.com

  nameserver:
    - 1.2.4.8
    - 114.114.114.114
    - 223.5.5.5
    - tls://13800000000.rubyfish.cn:853
    #- https://13800000000.rubyfish.cn/

  fallback: # 与 nameserver 内的服务器列表同时发起请求，当规则符合 GEOIP 在 CN 以外时，fallback 列表内的域名服务器生效。
    - tls://13800000000.rubyfish.cn:853
    - tls://1.0.0.1:853
    - tls://dns.google:853

    #- https://13800000000.rubyfish.cn/
    #- https://cloudflare-dns.com/dns-query
    #- https://dns.google/dns-query

  fallback-filter:
    geoip: true # 默认
    ipcidr: # 在这个网段内的 IP 地址会被考虑为被污染的 IP
      - 240.0.0.0/4

# 1. clash DNS 请求逻辑：
#   (1) 当访问一个域名时， nameserver 与 fallback 列表内的所有服务器并发请求，得到域名对应的 IP 地址。
#   (2) clash 将选取 nameserver 列表内，解析最快的结果。
#   (3) 若解析结果中，IP 地址属于 国外，那么 clash 将选择 fallback 列表内，解析最快的结果。
#
#   因此，我在 nameserver 和 fallback 内都放置了无污染、解析速度较快的国内 DNS 服务器，以达到最快的解析速度。
#   但是 fallback 列表内服务器会用在解析境外网站，为了结果绝对无污染，我仅保留了支持 DoT/DoH 的两个服务器。
#
# 2. clash DNS 配置注意事项：
#   (1) 如果您为了确保 DNS 解析结果无污染，请仅保留列表内以 tls:// 或 https:// 开头的 DNS 服务器，但是通常对于国内域名没有必要。
#   (2) 如果您不在乎可能解析到污染的结果，更加追求速度。请将 nameserver 列表的服务器插入至 fallback 列表内，并移除重复项。
#
# 3. 关于 DNS over HTTPS (DoH) 和 DNS over TLS (DoT) 的选择：
#   对于两项技术双方各执一词，而且会无休止的争论，各有利弊。各位请根据具体需求自行选择，但是配置文件内默认启用 DoT，因为目前国内没有封锁或管制。
#   DoH: 以 https:// 开头的 DNS 服务器。拥有更好的伪装性，且几乎不可能被运营商或网络管理封锁，但查询效率和安全性可能略低。
#   DoT: 以 tls:// 开头的 DNS 服务器。拥有更高的安全性和查询效率，但端口有可能被管制或封锁。
#   若要了解更多关于 DoH/DoT 相关技术，请自行查阅规范文档。

Proxy:
  # shadowsocks
  # 所支持的加密方式与 go-shadowsocks2 保持一致
  # 支持加密方式：
  #   aes-128-gcm aes-192-gcm aes-256-gcm
  #   aes-128-cfb aes-192-cfb aes-256-cfb
  #   aes-128-ctr aes-192-ctr aes-256-ctr
  #   rc4-md5 chacha20 chacha20-ietf xchacha20
  #   chacha20-ietf-poly1305 xchacha20-ietf-poly1305

  - name: "ss1"
    type: ss
    server: server
    port: 443
    cipher: chacha20-ietf-poly1305
    password: "password"
    # udp: true

  - name: "ss2"
    type: ss
    server: server
    port: 443
    cipher: AEAD_CHACHA20_POLY1305
    password: "password"
    plugin: obfs
    plugin-opts:
      mode: tls # 混淆模式，可以选择 http 或 tls
      host: bing.com # 混淆域名，需要和服务器配置保持一致

  - name: "ss3"
    type: ss
    server: server
    port: 443
    cipher: AEAD_CHACHA20_POLY1305
    password: "password"
    plugin: v2ray-plugin
    plugin-opts:
      mode: websocket # 暂时不支持 QUIC 协议
      # tls: true # wss
      # skip-cert-verify: true
      # host: bing.com
      # path: "/"
      # headers:
      #   custom: value

  # vmess
  # 支持加密方式：auto / aes-128-gcm / chacha20-poly1305 / none
  - name: "vmess"
    type: vmess
    server: server
    port: 443
    uuid: uuid
    alterId: 32
    cipher: auto
    # udp: true
    # tls: true
    # skip-cert-verify: true
    # network: ws
    # ws-path: /path
    # ws-headers:
    #   Host: v2ray.com

  # socks5
  - name: "socks"
    type: socks5
    server: server
    port: 443
    # username: username
    # password: password
    # tls: true
    # skip-cert-verify: true
    # udp: true

  # http
  - name: "http"
    type: http
    server: server
    port: 443
    # username: username
    # password: password
    # tls: true # https
    # skip-cert-verify: true

  # snell
  - name: "snell"
    type: snell
    server: server
    port: 44046
    psk: yourpsk
    # obfs-opts:
    # mode: http # 或 tls
    # host: bing.com

Proxy Group:
  # url-test 可以自动选择与指定 URL 测速后，延迟最短的服务器
  - name: "auto"
    type: url-test
    proxies:
      - ss1
      - ss2
      - vmess1
    url: "http://www.gstatic.com/generate_204"
    interval: 300

  # fallback 可以尽量按照用户书写的服务器顺序，在确保服务器可用的情况下，自动选择服务器
  - name: "fallback-auto"
    type: fallback
    proxies:
      - ss1
      - ss2
      - vmess1
    url: "http://www.gstatic.com/generate_204"
    interval: 300

  # load-balance 可以使相同 eTLD 请求在同一条代理线路上
  - name: "load-balance"
    type: load-balance
    proxies:
      - ss1
      - ss2
      - vmess1
    url: "http://www.gstatic.com/generate_204"
    interval: 300

  # select 用来允许用户手动选择 代理服务器 或 服务器组
  # 您也可以使用 RESTful API 去切换服务器，这种方式推荐在 GUI 中使用
  - name: Proxy
    type: select
    proxies:
      - ss1
      - ss2
      - vmess1
      - auto

Rule:
  # 抗 DNS 污染
  - DOMAIN-KEYWORD,amazon,Proxy
  - DOMAIN-KEYWORD,google,Proxy
  - DOMAIN-KEYWORD,gmail,Proxy
  - DOMAIN-KEYWORD,youtube,Proxy
  - DOMAIN-KEYWORD,facebook,Proxy
  - DOMAIN-SUFFIX,fb.me,Proxy
  - DOMAIN-SUFFIX,fbcdn.net,Proxy
  - DOMAIN-KEYWORD,twitter,Proxy
  - DOMAIN-KEYWORD,instagram,Proxy
  - DOMAIN-KEYWORD,dropbox,Proxy
  - DOMAIN-SUFFIX,twimg.com,Proxy
  - DOMAIN-KEYWORD,blogspot,Proxy
  - DOMAIN-SUFFIX,youtu.be,Proxy
  - DOMAIN-KEYWORD,whatsapp,Proxy

  # 常见广告域名屏蔽
  - DOMAIN-KEYWORD,admarvel,REJECT
  - DOMAIN-KEYWORD,admaster,REJECT
  - DOMAIN-KEYWORD,adsage,REJECT
  - DOMAIN-KEYWORD,adsmogo,REJECT
  - DOMAIN-KEYWORD,adsrvmedia,REJECT
  - DOMAIN-KEYWORD,adwords,REJECT
  - DOMAIN-KEYWORD,adservice,REJECT
  - DOMAIN-KEYWORD,domob,REJECT
  - DOMAIN-KEYWORD,duomeng,REJECT
  - DOMAIN-KEYWORD,dwtrack,REJECT
  - DOMAIN-KEYWORD,guanggao,REJECT
  - DOMAIN-KEYWORD,lianmeng,REJECT
  - DOMAIN-SUFFIX,mmstat.com,REJECT
  - DOMAIN-KEYWORD,omgmta,REJECT
  - DOMAIN-KEYWORD,openx,REJECT
  - DOMAIN-KEYWORD,partnerad,REJECT
  - DOMAIN-KEYWORD,pingfore,REJECT
  - DOMAIN-KEYWORD,supersonicads,REJECT
  - DOMAIN-KEYWORD,uedas,REJECT
  - DOMAIN-KEYWORD,umeng,REJECT
  - DOMAIN-KEYWORD,usage,REJECT
  - DOMAIN-KEYWORD,wlmonitor,REJECT
  - DOMAIN-KEYWORD,zjtoolbar,REJECT

  # LAN
  - DOMAIN-SUFFIX,local,DIRECT
  - IP-CIDR,127.0.0.0/8,DIRECT
  - IP-CIDR,172.16.0.0/12,DIRECT
  - IP-CIDR,192.168.0.0/16,DIRECT
  - IP-CIDR,10.0.0.0/8,DIRECT
  - IP-CIDR,17.0.0.0/8,DIRECT
  - IP-CIDR,100.64.0.0/10,DIRECT

  # 最终规则
  - GEOIP,CN,DIRECT
  - MATCH,Proxy
```
