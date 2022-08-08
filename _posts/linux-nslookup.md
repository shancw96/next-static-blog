---
title: linux常用命令-nslookup
categories: [运维]
tags: [nslookup, dns]
toc: true
date: 2022/4/11
---

Nslookup(Name Server Lookup 缩写)：查询Dns服务器，获取域名或ip地址。

<!-- more -->

语法：

```bash
nslookup [option]
```

Option 可选项：

+ nslookup google.com

  nslookup 加域名 会显示 域名的IP地址

  ```bash
  > nslookup google.com
  Server:		fe80::1%12
  Address:	fe80::1%12#53
  
  Non-authoritative answer:
  Name:	google.com
  Address: 142.251.42.238
  ```

+ nslookup 142.251.42.238

  反向dns查询

  ```bash
  Server:		fe80::1%12
  Address:	fe80::1%12#53
  
  Non-authoritative answer:
  238.42.251.142.in-addr.arpa	name = tsa01s11-in-f14.1e100.net.
  
  Authoritative answers can be found from:
  ```

更多option选项查看 

[nslookup command in linux](https://www.geeksforgeeks.org/nslookup-command-in-linux-with-examples)