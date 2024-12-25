use std::io::{BufWriter, Cursor};

use crate::{handlers::{resolve_png_unparsed, to_simple_json}, models, utils, Error, Result, WzReader};
use image::ImageFormat;
use serde_json::to_string;
use tauri::{command, AppHandle, Runtime, State, Window};
use wz_reader::{util::node_util, version::WzMapleVersion};
use base64::{Engine as _, engine::general_purpose};

#[command]
pub(crate) async fn init<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, WzReader<R>>,
    path: String,
    version: Option<String>,
) -> Result<()> {
    let version = version.map(|s| match s.as_str() {
        "GMS" => WzMapleVersion::GMS,
        "EMS" => WzMapleVersion::EMS,
        "BMS" => WzMapleVersion::BMS,
        _ => WzMapleVersion::UNKNOWN,
    });

    let base_node = utils::resolve_base(&path, version)
        .await
        .map_err(|_| crate::Error::InitWzFailed)?;

    state.replace_root(&base_node);

    Ok(())
}

#[command]
pub(crate) async fn parse_node<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, WzReader<R>>,
    path: String,
) -> Result<()> {
    let node_read = state.node.read().unwrap();

    let _ = node_read
        .at_path(&path)
        .map(|n| node_util::parse_node(&n))
        .ok_or(Error::NodeNotFound)?;

    Ok(())
}

#[command]
pub(crate) async fn unparse_node<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, WzReader<R>>,
    path: String,
) -> Result<()> {
    let node = state.node.read().unwrap();

    node.at_path(&path)
        .map(|n| n.write().unwrap().unparse())
        .ok_or(Error::NodeNotFound)?;

    Ok(())
}

#[command]
pub(crate) async fn get_node_info<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, WzReader<R>>,
    path: String,
) -> Result<models::NodeInfo> {
    let node = if path.is_empty() {
        state.node.clone()
    } else {
        state
            .node
            .read()
            .unwrap()
            .at_path(&path)
            .ok_or(Error::NodeNotFound)?
    };

    let node_read = node.read().unwrap();

    Ok(models::NodeInfo {
        name: node_read.name.to_string(),
        _type: to_string(&node_read.object_type)?,
        has_child: !node_read.children.is_empty(),
    })
}

#[command]
pub(crate) async fn get_json<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, WzReader<R>>,
    path: String,
) -> Result<serde_json::Value> {
    let node = if path.is_empty() {
        state.node.clone()
    } else {
        state
            .node
            .read()
            .unwrap()
            .at_path(&path)
            .ok_or(Error::NodeNotFound)?
    };

    let node_read = node.read().unwrap();

    to_simple_json(&node_read)
}
#[command]
pub(crate) async fn get_png<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, WzReader<R>>,
    path: String,
) -> Result<String> {
    let node = state.node.clone();

    let (image_node, path) =
        node_util::get_image_node_from_path(&node, &path).ok_or(Error::NodeNotFound)?;

    let image = resolve_png_unparsed(&image_node, &path, Some(&node))?;

    let mut buf = BufWriter::new(Cursor::new(Vec::new()));
    // maybe use ImageFormat::Webp is better it quicker and smaller.
    image
        .write_to(&mut buf, ImageFormat::Png)
        .map_err(|_| Error::ImageSendError)?;

    Ok(general_purpose::STANDARD.encode(buf.into_inner().unwrap().into_inner()))
}

#[command]
pub(crate) async fn get_childs_info<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, WzReader<R>>,
    path: String,
) -> Result<Vec<models::NodeInfo>> {
    let node = if path.is_empty() {
        state.node.clone()
    } else {
        state
            .node
            .read()
            .unwrap()
            .at_path(&path)
            .ok_or(Error::NodeNotFound)?
    };

    let node_read = node.read().unwrap();

    Ok(node_read
        .children
        .values()
        .map(|node| {
            let node_read = node.read().unwrap();
            models::NodeInfo {
                name: node_read.name.to_string(),
                _type: to_string(&node_read.object_type).unwrap(),
                has_child: !node_read.children.is_empty(),
            }
        })
        .collect())
}
