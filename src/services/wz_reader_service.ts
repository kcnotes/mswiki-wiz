import { invoke } from '@tauri-apps/api/core';

export type NodeChild = {
  name: string;
  hasChild: boolean;
};

/**
 * Interacts with the wz-reader plugin. In most cases, use individual services to
 * interact with the plugin, rather than calling parse/get directly.
 */
export const WzReaderService = {
  async init({ path }: { path: string }): Promise<string> {
    return invoke('plugin:wz-reader|init', { path });
  },

  async parseNode({ path }: { path: string }): Promise<null> {
    return invoke('plugin:wz-reader|parse_node', { path });
  },

  async parseChildren({ path }: { path: string }): Promise<null> {
    return invoke('plugin:wz-reader|parse_children', { path });
  },

  async getJson<T>({ path }: { path: string }): Promise<T> {
    return invoke('plugin:wz-reader|get_json', { path });
  },

  async getChildren({ path }: { path: string }): Promise<NodeChild[]> {
    return invoke('plugin:wz-reader|get_children', { path });
  },

  async getPng({ path }: { path: string }): Promise<string> {
    return invoke('plugin:wz-reader|get_png', { path });
  },
}
