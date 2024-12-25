use tauri::{
    plugin::{Builder, TauriPlugin},
    Manager, Runtime,
};
use wz_reader::{property::WzValue, WzNode, WzNodeName, WzObjectType};

pub use models::*;

mod desktop;

mod commands;
mod error;
mod models;

pub mod handlers;
pub mod utils;

pub use error::{Error, Result};

use desktop::WzReader;

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the wz-reader APIs.
pub trait WzReaderExt<R: Runtime> {
    fn wz_reader(&self) -> &WzReader<R>;
}

impl<R: Runtime, T: Manager<R>> crate::WzReaderExt<R> for T {
    fn wz_reader(&self) -> &WzReader<R> {
        self.state::<WzReader<R>>().inner()
    }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    let root_node = WzNode::new(
        &WzNodeName::from(""),
        WzObjectType::Value(WzValue::Null),
        None,
    )
    .into_lock();
    let tauri_node = root_node.clone();

    let app = Builder::new("wz-reader");

    let app = app.invoke_handler(tauri::generate_handler![
        commands::init,
        commands::get_json,
        commands::get_png,
        commands::parse_node,
        commands::unparse_node,
        commands::get_node_info,
        commands::get_childs_info,
    ]);

    app.setup(move |app, api| {
        let wz_reader = desktop::init(app, api, tauri_node)?;

        app.manage(wz_reader);
        Ok(())
    })
    .build()
}
