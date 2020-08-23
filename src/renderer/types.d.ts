import { Tab } from '@material-ui/core';
import { Draft } from 'immer';

export type Updater<S> = (f: (draft: Draft<S>) => void | S) => void;

export type ViewAs = 'text' | 'json' | 'binary';

export type MessageType = 'error' | 'warning' | 'info' | 'success';

export type ObjectListShowType = 'flat' | 'tree';

export type ObjectDataType = 'string' | 'hash' | 'list' | 'set' | 'zset';

export type TabType = 'object' | 'terminal' | 'luaEditor';

export type SecurityType = 'normal' | 'SSL/TSL' | 'SSHTunnel';

export interface Message {
  type: MessageType;
  visible: boolean;
  text: string;
  secondaryText?: string;
}

/**
 * 连接信息
 */
export interface Connection {
  /**
   * id
   */
  id: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 主机
   */
  host: string;

  /**
   * 端口
   */
  port: number;

  /**
   * 密码
   */
  password: string;

  /**
   * 安全类型
   */
  securityType?: SecurityType;

  /**
   * ssl 公钥
   */
  sslPublicKey: string;

  /**
   * ssl 私钥
   */
  sslPrivateKey: string;

  /**
   * ssl 认证中心
   */
  sslAuthority: string;

  /**
   * ssl 启用严格模式
   */
  sslEnableStrictMode: boolean;

  /**
   * ssh 服务器地址
   */
  sshHost: string;

  /**
   * ssh 服务器端口
   */
  sshPort: number;

  /**
   * ssh 用户名
   */
  sshUser: string;

  /**
   * ssh 启用私钥
   */
  sshEnablePrivateKey: boolean;

  /**
   * ssh 私钥
   */
  sshPrivateKey: string;

  /**
   * ssh 启用密码
   */
  sshEnablePassword: boolean;

  /**
   * ssh 密码
   */
  sshPassword: string;

  /**
   * ssh 启用 TLS-over-SSH
   */
  sshEnableTlsOverSsh: boolean;

  /**
   * 高级配置 - 默认filter
   */
  advDefaultFilter: string;

  /**
   * 高级配置 - 命名空间分隔符
   */
  advNameSpaceSeparator: string;

  /**
   * 高级配置 - 连接超时限制（秒）
   */
  advConnectionTimeout: number;
  /**
   * 高级配置 - 连接重试时间
   */
  advTotalRetryTime: number;

  /**
   * 高级配置 - 连接重试次数
   */
  advMaxAttempts: number;

  /**
   * 高级配置 - 执行超时限制（秒）
   */
  advExecutionTimeout: number;

  /**
   * 高级配置 - 数据库发现超时限制（秒）
   */
  advDatabasesDiscoveryLimit: number;

  /**
   * 高级配置 - 集群转向时改变主机
   */
  advChangeHostOnClusterRediects: boolean;
}

/**
 * 设置
 */
export interface Settings {
  /**
   * 主键
   */
  id: string;

  /**
   * 语言
   */
  language: string;

  /**
   * 界面字体
   */
  uiFont: string;

  /**
   * 界面字体大小
   */
  uiFontSize: number;

  /**
   * editor 界面字体
   */
  editorFont: string;

  /**
   * editor 字体大小
   */
  editorFontSize: number;

  /**
   * terminal字体
   */
  terminalFont: string;

  /**
   * terminal字体大小
   */
  terminalFontSize: number;

  /**
   * terminal 主题
   */
  terminalTheme: TerminalTheme;

  /**
   * 是否使用系统proxy
   */
  useSystemProxySettings: boolean;

  /**
   * 是否刷新时同时刷新namespace
   */
  reopenNamespacesOnReload: boolean;

  /**
   * 是否在对象数中启用排序
   */
  enableKeySortingInTree: boolean;

  /**
   * 实时更新最多允许的key数量
   */
  liveUpdateMaximumAllowedKeys: number;

  /**
   * 实时更新的间隔
   */
  liveUpdateInterval: number;
}

/**
 * 数据对象
 */
export interface DataObject {
  /**
   * id
   */
  id: string;

  /**
   * key
   */
  key: string;

  /**
   * 对象类型
   */
  dataType: ObjectDataType;

  /**
   * 过期时间
   */
  expire: number;

  /**
   * 在树形里显示时使用
   */
  isOpenByDefault?: boolean;
}

/**
 * String对象
 */
export interface StringDataObject extends DataObject {
  /**
   * 类型
   */
  dataType: 'string';
  /**
   *
   */
  value: string;
}

/**
 * List对象
 */
export interface ListDataObject extends DataObject {
  /**
   * 类型
   */
  dataType: 'list';
  /**
   * Total number of entris
   */
  total: number;
  /**
   * lrange开始
   */
  lrangeStart: number;
  /**
   * lrange结束
   */
  lrangeStop: number;
  /**
   * 值
   */
  values: ListValueType[];
}

/**
 * Hash对象
 */
export interface HashDataObject extends DataObject {
  /**
   * 类型
   */
  dataType: 'hash';
  /**
   * Match
   */
  match: string;
  /**
   * Count
   */
  count: number;
  /**
   * Total number of entris
   */
  total: number;
  /**
   * 上次的Cursor
   */
  lastCursor: number;
  /**
   * 值
   */
  values: HashValueType[];
}

/**
 * Set对象
 */
export interface SetDataObject extends DataObject {
  /**
   * 类型
   */
  dataType: 'set';
  /**
   * Match
   */
  match: string;
  /**
   * Count
   */
  count: number;
  /**
   * Total number of entris
   */
  total: number;
  /**
   * 上次的Cursor
   */
  lastCursor: number;
  /**
   * 值
   */
  values: SetValueType[];
}

/**
 * Zset对象
 */
export interface ZsetDataObject extends DataObject {
  /**
   * 类型
   */
  dataType: 'zset';
  /**
   * Match
   */
  match: string;
  /**
   * Count
   */
  count: number;
  /**
   * Total number of entris
   */
  total: number;
  /**
   * 上次的Cursor
   */
  lastCursor: number;
  /**
   * 值
   */
  values: ZsetValueType[];
}

/**
 * session 状态
 */
export type SessionStatus =
  | 'ready'
  | 'connect'
  | 'reconnecting'
  | 'error'
  | 'end'
  | 'warning';

/**
 * Tab
 */
export interface Tab {
  /**
   * Tab id
   */
  id: string;

  /**
   * Tab 名称
   */
  name: string;

  /**
   * Tab 类型
   */
  type: TabType;

  /**
   * 引用 id
   * 当 type 是对象时， referenceId 的值是对象的 id
   * 当 type 是terminal时， referenceId 的值是 terminal 的 id
   */
  referenceId?: string;

  /**
   * 是否是临时Tab
   */
  temporary: boolean;
}
/**
 * Session
 */
export interface Session {
  /**
   * session id
   */
  id: string;

  /**
   * session name
   */
  name: string;

  /**
   * 激活的 tab id
   */
  activeTabId?: string;

  /**
   * connectionModel
   */
  connection: Connection;

  /**
   * 对象集合
   */
  objects: DataObject[];

  /**
   * 打开的 tab 集合
   */
  tabs: Tab[];

  /**
   * 状态
   */
  status: SessionStatus;

  /**
   * 工作指示器
   */
  progressing: boolean;

  /**
   * 服务器信息
   */
  serverInfo: Record<string, any>;

  /**
   * redis 的配置信息
   */
  serverConfig: Record<string, any>;

  /**
   * 当前选择的 db
   */
  activeDb: string;

  /**
   * 是否scan完成
   */
  scanDone: boolean;
}

/**
 * 终端主题
 */
export type TerminalTheme = 'onedark' | 'gruvbox_dark' | 'github';

export interface Log {
  time: Date;
  connection: string;
  command: string;
  args: any[];
}

export interface ListValueType {
  value: string;
}

export interface SetValueType {
  value: string;
}

export interface ZsetValueType {
  value: string;
  score: number;
}

export interface HashValueType {
  field: string;
  value: string;
}
