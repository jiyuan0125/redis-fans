export const commands = [
  'acl load',
  'acl save',
  'acl list',
  'acl users',
  'acl getuser',
  'acl setuser',
  'acl deluser',
  'acl cat',
  'acl genpass',
  'acl whoami',
  'acl log',
  'acl help',
  'append',
  'auth',
  'bgrewriteaof',
  'bgsave',
  'bitcount',
  'bitfield',
  'bitop',
  'bitpos',
  'blpop',
  'brpop',
  'brpoplpush',
  'bzpopmin',
  'bzpopmax',
  'client caching',
  'client id',
  'client kill',
  'client list',
  'client getname',
  'client getredir',
  'client pause',
  'client reply',
  'client setname',
  'client tracking',
  'client unblock',
  'cluster addslots',
  'cluster bumpepoch',
  'cluster count-failure-reports',
  'cluster countkeysinslot',
  'cluster delslots',
  'cluster failover',
  'cluster flushslots',
  'cluster forget',
  'clster getkeysinslot',
  'cluster info',
  'cluster keyslot',
  'cluster meet',
  'cluster myid',
  'cluster nodes',
  'cluster replicate',
  'cluster reset',
  'cluster saveconfig',
  'cluster set-config-epoch',
  'cluster setslot',
  'cluster slaves',
  'cluster replicas',
  'cluster slots',
  'command',
  'command count',
  'command getkeys',
  'command info',
  'config get',
  'config rewrite',
  'config set',
  'config resetstat',
  'dbsize',
  'debug object',
  'debug segfault',
  'decr',
  'decrby',
  'del',
  'discard',
  'dump',
  'echo',
  'eval',
  'evalsha',
  'exec',
  'exists',
  'expire',
  'expireat',
  'flushall',
  'flushdb',
  'geoadd',
  'geohash',
  'geopos',
  'geodist',
  'georadius',
  'georadiusbymember',
  'get',
  'getbit',
  'getrange',
  'getset',
  'hdel',
  'hello',
  'hexists',
  'hget',
  'hgetall',
  'hincrby',
  'hincrbyfloat',
  'hkeys',
  'hlen',
  'hmget',
  'hmset',
  'hset',
  'hsetnx',
  'hstrlen',
  'hvals',
  'incr',
  'incrby',
  'incrbyfloat',
  'info',
  'lolwut',
  'keys',
  'lastsave',
  'lindex',
  'linsert',
  'llen',
  'lpop',
  'lpos',
  'lpush',
  'lpushx',
  'lrange',
  'lrem',
  'lset',
  'ltrim',
  'memory doctor',
  'memory help',
  'memory malloc-stats',
  'memory purge',
  'memory stats',
  'memory usage',
  'mget',
  'migrate',
  'module list',
  'module load',
  'module unload',
  'monitor',
  'move',
  'mset',
  'msetnx',
  'multi',
  'object',
  'persist',
  'pexpire',
  'pexpireat',
  'pfadd',
  'pfcount',
  'pfmerge',
  'ping',
  'psetex',
  'psubscribe',
  'pubsub',
  'pttl',
  'publish',
  'punsubscribe',
  'quit',
  'randomkey',
  'readonly',
  'readwrite',
  'rename',
  'renamenx',
  'restore',
  'role',
  'rpop',
  'rpoplpush',
  'rpush',
  'rpushx',
  'sadd',
  'save',
  'scard',
  'script debug',
  'script exists',
  'script flush',
  'script kill',
  'script load',
  'sdiff',
  'sdiffstore',
  'select',
  'set',
  'setbit',
  'setex',
  'setnx',
  'setrange',
  'shutdown',
  'sinter',
  'sinterstore',
  'sismember',
  'slaveof',
  'replicaof',
  'slowlog',
  'smembers',
  'smove',
  'sort',
  'spop',
  'srandmember',
  'srem',
  'stralgo',
  'strlen',
  'subscribe',
  'sunion',
  'sunionstore',
  'swapdb',
  'sync',
  'psync',
  'time',
  'touch',
  'ttl',
  'type',
  'unsubscribe',
  'unlink',
  'unwatch',
  'wait',
  'watch',
  'zadd',
  'zcard',
  'zcount',
  'zincrby',
  'zinterstore',
  'zlexcount',
  'zpopmax',
  'zpopmin',
  'zrange',
  'zrangebylex',
  'zrevrangebylex',
  'zrangebyscore',
  'zrank',
  'zrem',
  'zremrangebylex',
  'zremrangebyrank',
  'zremrangebyscore',
  'zrevrange',
  'zrevrangebyscore',
  'zrevrank',
  'zscore',
  'zunionstore',
  'scan',
  'sscan',
  'hscan',
  'zscan',
  'xinfo',
  'xadd',
  'xtrim',
  'xdel',
  'xrange',
  'xrevrange',
  'xlen',
  'xread',
  'xgroup',
  'xreadgroup',
  'xack',
  'xclaim',
  'xpending',
  'latency doctor',
  'latency graph',
  'latency history',
  'latency latest',
  'latency reset',
  'latency help',
];

/**
 * name, params, summary, group, since
 */
export const commandHelps = [
  [
    'acl cat',
    '[categoryname]',
    'List the ACL categories or the commands inside a category',
    9,
    '6.0.0',
  ],
  [
    'acl deluser',
    'username, [username ...]',
    'Remove the specified ACL users and the associated rules',
    9,
    '6.0.0',
  ],
  [
    'acl genpass',
    '[bits]',
    'Generate a pseudorandom secure password to use for ACL users',
    9,
    '6.0.0',
  ],
  [
    'acl getuser',
    'username',
    'Get the rules for a specific ACL user',
    9,
    '6.0.0',
  ],
  [
    'acl help',
    '-',
    'Show helpful text about the different subcommands',
    9,
    '6.0.0',
  ],
  [
    'acl list',
    '-',
    'List the current ACL rules in ACL config file format',
    9,
    '6.0.0',
  ],
  ['acl load', '-', 'Reload the ACLs from te configured ACL file', 9, '6.0.0'],
  [
    'acl log',
    '[count or RESET]',
    'List latest events denied because of ACLs in place',
    9,
    '6.0.0',
  ],
  [
    'acl save',
    '-',
    'Save the current ACL rules in the configured ACL file',
    9,
    '6.0.0',
  ],
  [
    'acl setuser',
    'username, [rule [rule ...]]',
    'Modify or create the rules for a specific ACL user',
    9,
    '6.0.0',
  ],
  [
    'acl users',
    '-',
    'List the username of all the configured ACL rules',
    9,
    '6.0.0',
  ],
  [
    'acl whoami',
    '-',
    'Return the name of the user associated to the current connection',
    9,
    '6.0.0',
  ],
  ['append', 'key, value', 'Append a value to a key', 1, '2.0.0'],
  ['auth', 'password', 'Authenticate to the server', 8, '1.0.0'],
  [
    'bgrewriteaof',
    '-',
    'Asynchronously rewrite the append-only file',
    9,
    '1.0.0',
  ],
  [
    'bgsave',
    '[SCHEDULE]',
    'Asynchronously save the dataset to disk',
    9,
    '1.0.0',
  ],
  ['bitcount', 'key [start end]', 'Count set bits in a string', 1, '2.6.0'],
  [
    'bitfield',
    'key, [GET type offset], [SET type offset value], [INCRBY type offset increment], [OVERFLOW WRAP|SAT|FAIL]',
    'Perform arbitrary bitfield integer operations on strings',
    1,
    '3.2.0',
  ],
  [
    'bitop',
    'operation, destkey, key, [key ...]',
    'Perform bitwise operations between strings',
    1,
    '2.6.0',
  ],
  [
    'bitpos',
    'key, bit, [start], [end]',
    'Find first bit set or clear in a string',
    1,
    '2.8.7',
  ],
  [
    'blpop',
    'key, [key ...], timeout',
    'Remove and get the first element in a list, or block until one is available',
    2,
    '2.0.0',
  ],
  [
    'brpop',
    'key, [key ...], timeout',
    'Remove and get the last element in a list, or block until one is available',
    2,
    '2.0.0',
  ],
  [
    'brpoplpush',
    'source, destination, timeout',
    'Pop an element from a list, push it to another list and return it; or block until one is available',
    2,
    '2.2.0',
  ],
  [
    'bzpopmax',
    'key, [key ...], timeout',
    'Remove and return the member with the highest score from one or more sorted sets, or block until one is available',
    4,
    '5.0.0',
  ],
  [
    'bzpopmin',
    'key, [key ...], timeout',
    'Remove and return the member with the lowest score from one or more sorted sets, or block until one is available',
    4,
    '5.0.0',
  ],
  [
    'client caching',
    'YES|NO',
    'Instruct the server about tracking or not keys in the next request',
    8,
    '6.0.0',
  ],
  ['client getname', '-', 'Get the current connection name', 8, '2.6.9'],
  [
    'client getredir',
    '-',
    'Get tracking notifications redirection client ID if any',
    8,
    '6.0.0',
  ],
  [
    'client id',
    '-',
    'Returns the client ID for the current connection',
    8,
    '5.0.0',
  ],
  [
    'client kill',
    '[ip:port], [ID client-id], [TYPE normal|master|slave|pubsub], [USER username], [ADDR ip:port], [SKIPME yes/no]',
    'Kill the connection of a client',
    8,
    '2.4.0',
  ],
  [
    'client list',
    '[TYPE normal|master|replica|pubsub]',
    'Get the list of client connections',
    8,
    '2.4.0',
  ],
  [
    'client pause',
    'timeout',
    'Stop processing commands from clients for some time',
    8,
    '2.9.50',
  ],
  [
    'client reply',
    'ON|OFF|SKIP',
    'Instruct the server whether to reply to commands',
    8,
    '3.2.0',
  ],
  [
    'client setname',
    'connection-name',
    'Set the current connection name',
    8,
    '2.6.9',
  ],
  [
    'client tracking',
    'ON|OFF, [REDIRECT client-id], [PREFIX prefix [PREFIX prefix ...]], [BCAST], [OPTIN], [OPTOUT], [NOLOOP]',
    'Enable or disable server assisted client side caching support',
    8,
    '6.0.0',
  ],
  [
    'client unblock',
    'client-id, [TIMEOUT|ERROR]',
    'Unblock a client blocked in a blocking command from a different connection',
    8,
    '5.0.0',
  ],
  [
    'cluster addslots',
    'slot, [slot ...]',
    'Assign new hash slots to receiving node',
    12,
    '3.0.0',
  ],
  ['cluster bumpepoch', '-', 'Advance the cluster config epoch', 12, '3.0.0'],
  [
    'cluster count-failure-reports',
    'node-id',
    'Return the number of failure reports active for a given node',
    12,
    '3.0.0',
  ],
  [
    'cluster countkeysinslot',
    'slot',
    'Return the number of local keys in the specified hash slot',
    12,
    '3.0.0',
  ],
  [
    'cluster delslots',
    'slot, [slot ...]',
    'Set hash slots as unbound in receiving node',
    12,
    '3.0.0',
  ],
  [
    'cluster failover',
    '[FORCE|TAKEOVER]',
    'Forces a replica to perform a manual failover of its master.',
    12,
    '3.0.0',
  ],
  [
    'cluster flushslots',
    '-',
    "Delete a node's own slots information",
    12,
    '3.0.0',
  ],
  [
    'cluster forget',
    'node-id',
    'Remove a node from the nodes table',
    12,
    '3.0.0',
  ],
  [
    'cluster getkeysinslot',
    'slot, count',
    'Return local key names in the specified hash slot',
    12,
    '3.0.0',
  ],
  [
    'cluster info',
    '-',
    'Provides info about Redis Cluster node state',
    12,
    '3.0.0',
  ],
  [
    'cluster keyslot',
    'key',
    'Returns the hash slot of the specified key',
    12,
    '3.0.0',
  ],
  [
    'cluster meet',
    'ip, port',
    'Force a node cluster to handshake with another node',
    12,
    '3.0.0',
  ],
  ['cluster myid', '-', 'Return the node id', 12, '3.0.0'],
  ['cluster nodes', '-', 'Get Cluster config for the node', 12, '3.0.0'],
  [
    'cluster replicas',
    'node-id',
    'List replica nodes of the specified master node',
    12,
    '5.0.0',
  ],
  [
    'cluster replicate',
    'node-id',
    'Reconfigure a node as a replica of the specified master node',
    12,
    '3.0.0',
  ],
  ['cluster reset', '[HARD|SOFT]', 'Reset a Redis Cluster node', 12, '3.0.0'],
  [
    'cluster saveconfig',
    '-',
    'Forces the node to save cluster state on disk',
    12,
    '3.0.0',
  ],
  [
    'cluster set-config-epoch',
    'config-epoch',
    'Set the configuration epoch in a new node',
    12,
    '3.0.0',
  ],
  [
    'cluster setslot',
    'slot, IMPORTING|MIGRATING|STABLE|NODE, [node-id]',
    'Bind a hash slot to a specific node',
    12,
    '3.0.0',
  ],
  [
    'cluster slaves',
    'node-id',
    'List replica nodes of the specified master node',
    12,
    '3.0.0',
  ],
  [
    'cluster slots',
    '-',
    'Get array of Cluster slot to node mappings',
    12,
    '3.0.0',
  ],
  ['command', '-', 'Get array of Redis command details', 9, '2.8.13'],
  ['command count', '-', 'Get total number of Redis commands', 9, '2.8.13'],
  [
    'command getkeys',
    '-',
    'Extract keys given a full Redis command',
    9,
    '2.8.13',
  ],
  [
    'command info',
    'command-name, [command-name ...]',
    'Get array of specific Redis command details',
    9,
    '2.8.13',
  ],
  [
    'config get',
    'parameter',
    'Get the value of a configuration parameter',
    9,
    '2.0.0',
  ],
  ['config resetstat', '-', 'Reset the stats returned by INFO', 9, '2.0.0'],
  [
    'config rewrite',
    '-',
    'Rewrite the configuration file with the in memory configuration',
    9,
    '2.8.0',
  ],
  [
    'config set',
    'parameter, value',
    'Set a configuration parameter to the given value',
    9,
    '2.0.0',
  ],
  [
    'dbsize',
    '-',
    'Return the number of keys in the selected database',
    9,
    '1.0.0',
  ],
  ['debug object', 'key', 'Get debugging information about a key', 9, '1.0.0'],
  ['debug segfault', '-', 'Make the server crash', 9, '1.0.0'],
  ['decr', 'key', 'Decrement the integer value of a key by one', 1, '1.0.0'],
  [
    'decrby',
    'key, decrement',
    'Decrement the integer value of a key by the given number',
    1,
    '1.0.0',
  ],
  ['del', 'key, [key ...]', 'Delete a key', 0, '1.0.0'],
  ['discard', '-', 'Discard all commands issued after MULTI', 7, '2.0.0'],
  [
    'dump',
    'key',
    'Return a serialized version of the value stored at the specified key.',
    0,
    '2.6.0',
  ],
  ['echo', 'message', 'Echo the given string', 8, '1.0.0'],
  [
    'eval',
    'script, numkeys, key, [key ...], arg, [arg ...]',
    'Execute a Lua script server side',
    10,
    '2.6.0',
  ],
  [
    'evalsha',
    'sha1, numkeys, key, [key ...], arg, [arg ...]',
    'Execute a Lua script server side',
    10,
    '2.6.0',
  ],
  ['exec', '-', 'Execute all commands issued after MULTI', 7, '1.2.0'],
  ['exists', 'key, [key ...]', 'Determine if a key exists', 0, '1.0.0'],
  ['expire', 'key, seconds', "Set a key's time to live in seconds", 0, '1.0.0'],
  [
    'expireat',
    'key, timestamp',
    'Set the expiration for a key as a UNIX timestamp',
    0,
    '1.2.0',
  ],
  ['flushall', '[ASYNC]', 'Remove all keys from all databases', 9, '1.0.0'],
  [
    'flushdb',
    '[ASYNC]',
    'Remove all keys from the current database',
    9,
    '1.0.0',
  ],
  [
    'geoadd',
    'key, longitude, latitude, member, [longitude latitude member ...]',
    'Add one or more geospatial items in the geospatial index represented using a sorted set',
    13,
    '3.2.0',
  ],
  [
    'geodist',
    'key, member1, member2, [m|km|ft|mi]',
    'Returns the distance between two members of a geospatial index',
    13,
    '3.2.0',
  ],
  [
    'geohash',
    'key, member, [member ...]',
    'Returns members of a geospatial index as standard geohash strings',
    13,
    '3.2.0',
  ],
  [
    'geopos',
    'key, member, [member ...]',
    'Returns longitude and latitude of members of a geospatial index',
    13,
    '3.2.0',
  ],
  [
    'georadius',
    'key, longitude, latitude, radius, m|km|ft|mi, [WITHCOORD], [WITHDIST], [WITHHASH], [COUNT count], [ASC|DESC], [STORE key], [STOREDIST key]',
    'Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a point',
    13,
    '3.2.0',
  ],
  [
    'georadiusbymember',
    'key, member, radius, m|km|ft|mi, [WITHCOORD], [WITHDIST], [WITHHASH], [COUNT count], [ASC|DESC], [STORE key], [STOREDIST key]',
    'Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a member',
    13,
    '3.2.0',
  ],
  ['get', 'key', 'Get the value of a key', 1, '1.0.0'],
  [
    'getbit',
    'key, offset',
    'Returns the bit value at offset in the string value stored at key',
    1,
    '2.2.0',
  ],
  [
    'getrange',
    'key, start, end',
    'Get a substring of the string stored at a key',
    1,
    '2.4.0',
  ],
  [
    'getset',
    'key, value',
    'Set the string value of a key and return its old value',
    1,
    '1.0.0',
  ],
  [
    'hdel',
    'key, field, [field ...]',
    'Delete one or more hash fields',
    5,
    '2.0.0',
  ],
  [
    'hello',
    'protover, [AUTH username password], [SETNAME clientname]',
    'switch Redis protocol',
    8,
    '6.0.0',
  ],
  ['hexists', 'key, field', 'Determine if a hash field exists', 5, '2.0.0'],
  ['hget', 'key, field', 'Get the value of a hash field', 5, '2.0.0'],
  ['hgetall', 'key', 'Get all the fields and values in a hash', 5, '2.0.0'],
  [
    'hincrby',
    'key, field, increment',
    'Increment the integer value of a hash field by the given number',
    5,
    '2.0.0',
  ],
  [
    'hincrbyfloat',
    'key, field, increment',
    'Increment the float value of a hash field by the given amount',
    5,
    '2.6.0',
  ],
  ['hkeys', 'key', 'Get all the fields in a hash', 5, '2.0.0'],
  ['hlen', 'key', 'Get the number of fields in a hash', 5, '2.0.0'],
  [
    'hmget',
    'key, field, [field ...]',
    'Get the values of all the given hash fields',
    5,
    '2.0.0',
  ],
  [
    'hmset',
    'key, field, value, [field value ...]',
    'Set multiple hash fields to multiple values',
    5,
    '2.0.0',
  ],
  [
    'hscan',
    'key, cursor, [MATCH pattern], [COUNT count]',
    'Incrementally iterate hash fields and associated values',
    5,
    '2.8.0',
  ],
  [
    'hset',
    'key, field, value, [field value ...]',
    'Set the string value of a hash field',
    5,
    '2.0.0',
  ],
  [
    'hsetnx',
    'key, field, value',
    'Set the value of a hash field, only if the field does not exist',
    5,
    '2.0.0',
  ],
  [
    'hstrlen',
    'key, field',
    'Get the length of the value of a hash field',
    5,
    '3.2.0',
  ],
  ['hvals', 'key', 'Get all the values in a hash', 5, '2.0.0'],
  ['incr', 'key', 'Increment the integer value of a key by one', 1, '1.0.0'],
  [
    'incrby',
    'key, increment',
    'Increment the integer value of a key by the given amount',
    1,
    '1.0.0',
  ],
  [
    'incrbyfloat',
    'key, increment',
    'Increment the float value of a key by the given amount',
    1,
    '2.6.0',
  ],
  [
    'info',
    '[section]',
    'Get information and statistics about the server',
    9,
    '1.0.0',
  ],
  ['keys', 'pattern', 'Find all keys matching the given pattern', 0, '1.0.0'],
  [
    'lastsave',
    '-',
    'Get the UNIX time stamp of the last successful save to disk',
    9,
    '1.0.0',
  ],
  [
    'latency doctor',
    '-',
    'Return a human readable latency analysis report.',
    9,
    '2.8.13',
  ],
  [
    'latency graph',
    'event',
    'Return a latency graph for the event.',
    9,
    '2.8.13',
  ],
  [
    'latency help',
    '-',
    'Show helpful text about the different subcommands.',
    9,
    '2.8.13',
  ],
  [
    'latency history',
    'event',
    'Return timestamp-latency samples for the event.',
    9,
    '2.8.13',
  ],
  [
    'latency latest',
    '-',
    'Return the latest latency samples for all events.',
    9,
    '2.8.13',
  ],
  [
    'latency reset',
    '[event [event ...]]',
    'Reset latency data for one or more events.',
    9,
    '2.8.13',
  ],
  [
    'lindex',
    'key, index',
    'Get an element from a list by its index',
    2,
    '1.0.0',
  ],
  [
    'linsert',
    'key, BEFORE|AFTER, pivot, element',
    'Insert an element before or after another element in a list',
    2,
    '2.2.0',
  ],
  ['llen', 'key', 'Get the length of a list', 2, '1.0.0'],
  [
    'lolwut',
    '[VERSION version]',
    'Display some computer art and the Redis version',
    9,
    '5.0.0',
  ],
  ['lpop', 'key', 'Remove and get the first element in a list', 2, '1.0.0'],
  [
    'lpos',
    'key, element, [FIRST rank], [COUNT num-matches], [MAXLEN len]',
    'Return the index of matching elements on a list',
    2,
    '6.0.6',
  ],
  [
    'lpush',
    'key, element, [element ...]',
    'Prepend one or multiple elements to a list',
    2,
    '1.0.0',
  ],
  [
    'lpushx',
    'key, element, [element ...]',
    'Prepend an element to a list, only if the list exists',
    2,
    '2.2.0',
  ],
  [
    'lrange',
    'key, start, stop',
    'Get a range of elements from a list',
    2,
    '1.0.0',
  ],
  ['lrem', 'key count element', 'Remove elements from a list', 2, '1.0.0'],
  [
    'lset',
    'key, index, element',
    'Set the value of an element in a list by its index',
    2,
    '1.0.0',
  ],
  [
    'ltrim',
    'key, start, stop',
    'Trim a list to the specified range',
    2,
    '1.0.0',
  ],
  ['memory doctor', '-', 'Outputs memory problems report', 9, '4.0.0'],
  [
    'memory help',
    '-',
    'Show helpful text about the different subcommands',
    9,
    '4.0.0',
  ],
  ['memory malloc-stats', '-', 'Show allocator internal stats', 9, '4.0.0'],
  ['memory purge', '-', 'Ask the allocator to release memory', 9, '4.0.0'],
  ['memory stats', '-', 'Show memory usage details', 9, '4.0.0'],
  [
    'memory usage',
    'key, [SAMPLES count]',
    'Estimate the memory usage of a key',
    9,
    '4.0.0',
  ],
  [
    'mget',
    'key, [key ...]',
    'Get the values of all the given keys',
    1,
    '1.0.0',
  ],
  [
    'migrate',
    'host, port, key| destination-db timeout [COPY] [REPLACE] [AUTH password] [KEYS key]',
    'Atomically transfer a key from a Redis instance to another one.',
    0,
    '2.6.0',
  ],
  ['module list', '-', 'List all modules loaded by the server', 9, '4.0.0'],
  ['module load', 'path, [arg]', 'Load a module', 9, '4.0.0'],
  ['module unload', 'name', 'Unload a module', 9, '4.0.0'],
  [
    'monitor',
    '-',
    'Listen for all requests received by the server in real time',
    9,
    '1.0.0',
  ],
  ['move', 'key db', 'Move a key to another database', 0, '1.0.0'],
  [
    'mset',
    'key, value, [key value ...]',
    'Set multiple keys to multiple values',
    1,
    '1.0.1',
  ],
  [
    'msetnx',
    'key, value, [key value ...]',
    'Set multiple keys to multiple values, only if none of the keys exist',
    1,
    '1.0.1',
  ],
  ['multi', '-', 'Mark the start of a transaction block', 7, '1.2.0'],
  [
    'object',
    'subcommand, [arguments [arguments ...]]',
    'Inspect the internals of Redis objects',
    0,
    '2.2.3',
  ],
  ['persist', 'key', 'Remove the expiration from a key', 0, '2.2.0'],
  [
    'pexpire',
    'key, milliseconds',
    "Set a key's time to live in milliseconds",
    0,
    '2.6.0',
  ],
  [
    'pexpireat',
    'key, milliseconds-timestamp',
    'Set the expiration for a key as a UNIX timestamp specified in milliseconds',
    0,
    '2.6.0',
  ],
  [
    'pfadd',
    'key, element, [element ...]',
    'Adds the specified elements to the specified HyperLogLog.',
    11,
    '2.8.9',
  ],
  [
    'pfcount',
    'key, [key ...]',
    'Return the approximated cardinality of the set(s) observed by the HyperLogLog at key(s).',
    11,
    '2.8.9',
  ],
  [
    'pfmerge',
    'destkey, sourcekey, [sourcekey ...]',
    'Merge N different HyperLogLogs into a single one.',
    11,
    '2.8.9',
  ],
  ['ping', '[message]', 'Ping the server', 8, '1.0.0'],
  [
    'psetex',
    'key, milliseconds, value',
    'Set the value and expiration in milliseconds of a key',
    1,
    '2.6.0',
  ],
  [
    'psubscribe',
    'pattern, [pattern ...]',
    'Listen for messages published to channels matching the given patterns',
    6,
    '2.0.0',
  ],
  [
    'psync',
    'replicationid, offset',
    'Internal command used for replication',
    9,
    '2.8.0',
  ],
  ['pttl', 'key', 'Get the time to live for a key in milliseconds', 0, '2.6.0'],
  ['publish', 'channel, message', 'Post a message to a channel', 6, '2.0.0'],
  [
    'pubsub',
    'subcommand, [argument [argument ...]]',
    'Inspect the state of the Pub/Sub subsystem',
    6,
    '2.8.0',
  ],
  [
    'punsubscribe',
    '[pattern [pattern ...]]',
    'Stop listening for messages posted to channels matching the given patterns',
    6,
    '2.0.0',
  ],
  ['quit', '-', 'Close the connection', 8, '1.0.0'],
  ['randomkey', '-', 'Return a random key from the keyspace', 0, '1.0.0'],
  [
    'readonly',
    '-',
    'Enables read queries for a connection to a cluster replica node',
    12,
    '3.0.0',
  ],
  [
    'readwrite',
    '-',
    'Disables read queries for a connection to a cluster replica node',
    12,
    '3.0.0',
  ],
  ['rename', 'key, newkey', 'Rename a key', 0, '1.0.0'],
  [
    'renamenx',
    'key, newkey',
    'Rename a key, only if the new key does not exist',
    0,
    '1.0.0',
  ],
  [
    'replicaof',
    'host, port',
    'Make the server a replica of another instance, or promote it as master.',
    9,
    '5.0.0',
  ],
  [
    'restore',
    'key, ttl, serialized-value, [REPLACE], [ABSTTL], [IDLETIME seconds], [FREQ frequency]',
    'Create a key using the provided serialized value, previously obtained using DUMP.',
    0,
    '2.6.0',
  ],
  [
    'role',
    '-',
    'Return the role of the instance in the context of replication',
    9,
    '2.8.12',
  ],
  ['rpop', 'key', 'Remove and get the last element in a list', 2, '1.0.0'],
  [
    'rpoplpush',
    'source, destination',
    'Remove the last element in a list, prepend it to another list and return it',
    2,
    '1.2.0',
  ],
  [
    'rpush',
    'key, element, [element ...]',
    'Append one or multiple elements to a list',
    2,
    '1.0.0',
  ],
  [
    'rpushx',
    'key, element, [element ...]',
    'Append an element to a list, only if the list exists',
    2,
    '2.2.0',
  ],
  [
    'sadd',
    'key, member, [member ...]',
    'Add one or more members to a set',
    3,
    '1.0.0',
  ],
  ['save', '-', 'Synchronously save the dataset to disk', 9, '1.0.0'],
  [
    'scan',
    'cursor, [MATCH pattern], [COUNT count], [TYPE type]',
    'Incrementally iterate the keys space',
    0,
    '2.8.0',
  ],
  ['scard', 'key', 'Get the number of members in a set', 3, '1.0.0'],
  [
    'script debug',
    'YES|SYNC|NO',
    'Set the debug mode for executed scripts.',
    10,
    '3.2.0',
  ],
  [
    'script exists',
    'sha1, [sha1 ...]',
    'Check existence of scripts in the script cache.',
    10,
    '2.6.0',
  ],
  [
    'script flush',
    '-',
    'Remove all the scripts from the script cache.',
    10,
    '2.6.0',
  ],
  ['script kill', '-', 'Kill the script currently in execution.', 10, '2.6.0'],
  [
    'script load',
    'script',
    'Load the specified Lua script into the script cache.',
    10,
    '2.6.0',
  ],
  ['sdiff', 'key [key ...]', 'Subtract multiple sets', 3, '1.0.0'],
  [
    'sdiffstore',
    'destination, key, [key ...]',
    'Subtract multiple sets and store the resulting set in a key',
    3,
    '1.0.0',
  ],
  [
    'select',
    'index',
    'Change the selected database for the current connection',
    8,
    '1.0.0',
  ],
  [
    'set',
    'key, value, [EX seconds|PX milliseconds], [NX|XX], [KEEPTTL]',
    'Set the string value of a key',
    1,
    '1.0.0',
  ],
  [
    'setbit',
    'key, offset, value',
    'Sets or clears the bit at offset in the string value stored at key',
    1,
    '2.2.0',
  ],
  [
    'setex',
    'key, seconds, value',
    'Set the value and expiration of a key',
    1,
    '2.0.0',
  ],
  [
    'setnx',
    'key, value',
    'Set the value of a key, only if the key does not exist',
    1,
    '1.0.0',
  ],
  [
    'setrange',
    'key, offset, value',
    'Overwrite part of a string at key starting at the specified offset',
    1,
    '2.2.0',
  ],
  [
    'shutdown',
    '[NOSAVE|SAVE]',
    'Synchronously save the dataset to disk and then shut down the server',
    9,
    '1.0.0',
  ],
  ['sinter', 'key [key ...]', 'Intersect multiple sets', 3, '1.0.0'],
  [
    'sinterstore',
    'destination, key, [key ...]',
    'Intersect multiple sets and store the resulting set in a key',
    3,
    '1.0.0',
  ],
  [
    'sismember',
    'key, member',
    'Determine if a given value is a member of a set',
    3,
    '1.0.0',
  ],
  [
    'slaveof',
    'host, port',
    'Make the server a replica of another instance, or promote it as master. Deprecated starting with Redis 5. Use REPLICAOF instead.',
    9,
    '1.0.0',
  ],
  [
    'slowlog',
    'subcommand, [argument]',
    'Manages the Redis slow queries log',
    9,
    '2.2.12',
  ],
  ['smembers', 'key', 'Get all the members in a set', 3, '1.0.0'],
  [
    'smove',
    'source, destination, member',
    'Move a member from one set to another',
    3,
    '1.0.0',
  ],
  [
    'sort',
    'key, [BY pattern], [LIMIT offset count], [GET pattern [GET pattern ...]], [ASC|DESC], [ALPHA], [STORE destination]',
    'Sort the elements in a list, set or sorted set',
    0,
    '1.0.0',
  ],
  [
    'spop',
    'key, [count]',
    'Remove and return one or multiple random members from a set',
    3,
    '1.0.0',
  ],
  [
    'srandmember',
    'key, [count]',
    'Get one or multiple random members from a set',
    3,
    '1.0.0',
  ],
  [
    'srem',
    'key, member, [member ...]',
    'Remove one or more members from a set',
    3,
    '1.0.0',
  ],
  [
    'sscan',
    'key, cursor, [MATCH pattern], [COUNT count]',
    'Incrementally iterate Set elements',
    3,
    '2.8.0',
  ],
  [
    'stralgo',
    'LCS, algo-specific-argument, [algo-specific-argument ...]',
    'Run algorithms (currently LCS) against strings',
    1,
    '6.0.0',
  ],
  ['strlen', 'key', 'Get the length of the value stored in a key', 1, '2.2.0'],
  [
    'subscribe',
    'channel, [channel ...]',
    'Listen for messages published to the given channels',
    6,
    '2.0.0',
  ],
  ['sunion', 'key [key ...]', 'Add multiple sets', 3, '1.0.0'],
  [
    'sunionstore',
    'destination, key, [key ...]',
    'Add multiple sets and store the resulting set in a key',
    3,
    '1.0.0',
  ],
  ['swapdb', 'index1, index2', 'Swaps two Redis databases', 9, '4.0.0'],
  ['sync', '-', 'Internal command used for replication', 9, '1.0.0'],
  ['time', '-', 'Return the current server time', 9, '2.6.0'],
  [
    'touch',
    'key, [key ...]',
    'Alters the last access time of a key(s). Returns the number of existing keys specified.',
    0,
    '3.2.1',
  ],
  ['ttl', 'key', 'Get the time to live for a key', 0, '1.0.0'],
  ['type', 'key', 'Determine the type stored at key', 0, '1.0.0'],
  [
    'unlink',
    'key, [key ...]',
    'Delete a key asynchronously in another thread. Otherwise it is just as DEL, but non blocking.',
    0,
    '4.0.0',
  ],
  [
    'unsubscribe',
    '[channel [channel ...]]',
    'Stop listening for messages posted to the given channels',
    6,
    '2.0.0',
  ],
  ['unwatch', '-', 'Forget about all watched keys', 7, '2.2.0'],
  [
    'wait',
    'numreplicas, timeout',
    'Wait for the synchronous replication of all the write commands sent in the context of the current connection',
    0,
    '3.0.0',
  ],
  [
    'watch',
    'key, [key ...]',
    'Watch the given keys to determine execution of the MULTI/EXEC block',
    7,
    '2.2.0',
  ],
  [
    'xack',
    'key, group, ID, [ID ...]',
    'Marks a pending message as correctly processed, effectively removing it from the pending entries list of the consumer group. Return value of the command is the number of messages successfully acknowledged, that is, the IDs we were actually able to resolve in the PEL.',
    14,
    '5.0.0',
  ],
  [
    'xadd',
    'key, ID, field, value, [field value ...]',
    'Appends a new entry to a stream',
    14,
    '5.0.0',
  ],
  [
    'xclaim',
    'key, group, consumer, min-idle-time, ID, [ID ...], [IDLE ms], [TIME ms-unix-time], [RETRYCOUNT count], [force], [justid]',
    'Changes (or acquires) ownership of a message in a consumer group, as if the message was delivered to the specified consumer.',
    14,
    '5.0.0',
  ],
  [
    'xdel',
    'key, ID, [ID ...]',
    'Removes the specified entries from the stream. Returns the number of items actually deleted, that may be different from the number of IDs passed in case certain IDs do not exist.',
    14,
    '5.0.0',
  ],
  [
    'xgroup',
    '[CREATE key groupname id-or-$], [SETID key groupname id-or-$], [DESTROY key groupname], [DELCONSUMER key groupname consumername]',
    'Create, destroy, and manage consumer groups.',
    14,
    '5.0.0',
  ],
  [
    'xinfo',
    '[CONSUMERS key groupname], [GROUPS key], [STREAM key], [HELP]',
    'Get information on streams and consumer groups',
    14,
    '5.0.0',
  ],
  ['xlen', 'key', 'Return the number of entires in a stream', 14, '5.0.0'],
  [
    'xpending',
    'key, group, [start end count], [consumer]',
    'Return information and entries from a stream consumer group pending entries list, that are messages fetched but never acknowledged.',
    14,
    '5.0.0',
  ],
  [
    'xrange',
    'key, start, end, [COUNT count]',
    'Return a range of elements in a stream, with IDs matching the specified IDs interval',
    14,
    '5.0.0',
  ],
  [
    'xread',
    '[COUNT count], [BLOCK milliseconds], STREAMS, key, [key ...], id, [id ...]',
    'Return never seen elements in multiple streams, with IDs greater than the ones reported by the caller for each stream. Can block.',
    14,
    '5.0.0',
  ],
  [
    'xreadgroup',
    'GROUP, group, consumer, [COUNT count], [BLOCK milliseconds], [NOACK], STREAMS, key, [key ...], ID, [ID ...]',
    'Return new entries from a stream using a consumer group, or access the history of the pending entries for a given consumer. Can block.',
    14,
    '5.0.0',
  ],
  [
    'xrevrange',
    'key, end, start, [COUNT count]',
    'Return a range of elements in a stream, with IDs matching the specified IDs interval, in reverse order (from greater to smaller IDs) compared to XRANGE',
    14,
    '5.0.0',
  ],
  [
    'xtrim',
    'key, MAXLEN, [~], count',
    "Trims the stream to (approximately if '~' is passed) a certain size",
    14,
    '5.0.0',
  ],
  [
    'zadd',
    'key, [NX|XX], [CH], [INCR], score, member, [score member ...]',
    'Add one or more members to a sorted set, or update its score if it already exists',
    4,
    '1.2.0',
  ],
  ['zcard', 'key', 'Get the number of members in a sorted set', 4, '1.2.0'],
  [
    'zcount',
    'key, min, max',
    'Count the members in a sorted set with scores within the given values',
    4,
    '2.0.0',
  ],
  [
    'zincrby',
    'key, increment, member',
    'Increment the score of a member in a sorted set',
    4,
    '1.2.0',
  ],
  [
    'zinterstore',
    'destination, numkeys, key, [key ...], [WEIGHTS weight], [AGGREGATE SUM|MIN|MAX]',
    'Intersect multiple sorted sets and store the resulting sorted set in a new key',
    4,
    '2.0.0',
  ],
  [
    'zlexcount',
    'key, min, max',
    'Count the number of members in a sorted set between a given lexicographical range',
    4,
    '2.8.9',
  ],
  [
    'zpopmax',
    'key, [count]',
    'Remove and return members with the highest scores in a sorted set',
    4,
    '5.0.0',
  ],
  [
    'zpopmin',
    'key, [count]',
    'Remove and return members with the lowest scores in a sorted set',
    4,
    '5.0.0',
  ],
  [
    'zrange',
    'key, start, stop, [WITHSCORES]',
    'Return a range of members in a sorted set, by index',
    4,
    '1.2.0',
  ],
  [
    'zrangebylex',
    'key, min, max, [LIMIT offset count]',
    'Return a range of members in a sorted set, by lexicographical range',
    4,
    '2.8.9',
  ],
  [
    'zrangebyscore',
    'key, min, max, [WITHSCORES], [LIMIT offset count]',
    'Return a range of members in a sorted set, by score',
    4,
    '1.0.5',
  ],
  [
    'zrank',
    'key, member',
    'Determine the index of a member in a sorted set',
    4,
    '2.0.0',
  ],
  [
    'zrem',
    'key, member, [member ...]',
    'Remove one or more members from a sorted set',
    4,
    '1.2.0',
  ],
  [
    'zremrangebylex',
    'key, min, max',
    'Remove all members in a sorted set between the given lexicographical range',
    4,
    '2.8.9',
  ],
  [
    'zremrangebyrank',
    'key, start, stop',
    'Remove all members in a sorted set within the given indexes',
    4,
    '2.0.0',
  ],
  [
    'zremrangebyscore',
    'key, min, max',
    'Remove all members in a sorted set within the given scores',
    4,
    '1.2.0',
  ],
  [
    'zrevrange',
    'key, start, stop, [WITHSCORES]',
    'Return a range of members in a sorted set, by index, with scores ordered from high to low',
    4,
    '1.2.0',
  ],
  [
    'zrevrangebylex',
    'key, max, min, [LIMIT offset count]',
    'Return a range of members in a sorted set, by lexicographical range, ordered from higher to lower strings.',
    4,
    '2.8.9',
  ],
  [
    'zrevrangebyscore',
    'key, max, min, [WITHSCORES], [LIMIT offset count]',
    'Return a range of members in a sorted set, by score, with scores ordered from high to low',
    4,
    '2.2.0',
  ],
  [
    'zrevrank',
    'key, member',
    'Determine the index of a member in a sorted set, with scores ordered from high to low',
    4,
    '2.0.0',
  ],
  [
    'zscan',
    'key, cursor, [MATCH pattern], [COUNT count]',
    'Incrementally iterate sorted sets elements and associated scores',
    4,
    '2.8.0',
  ],
  [
    'zscore',
    'key, member',
    'Get the score associated with the given member in a sorted set',
    4,
    '1.2.0',
  ],
  [
    'zunionstore',
    'destination, numkeys, key, [key ...], [WEIGHTS weight], [AGGREGATE SUM|MIN|MAX]',
    'Add multiple sorted sets and store the resulting sorted set in a new key',
    4,
    '2.0.0',
  ],
];
