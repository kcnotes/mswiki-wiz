fn main() {
    tauri_plugin::Builder::new(&[
        "init",
        "get_json",
        "get_png",
        "execute",
        "parse_node",
        "unparse_node",
        "get_node_info",
        "get_children",
        "parse_children"
    ])
        .android_path("android")
        .ios_path("ios")
        .build();
}
