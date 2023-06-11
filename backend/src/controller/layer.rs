//! Layer endpoints.

use actix_web::{
    delete, get, post,
    web::{Data, Json, Path, Query},
    HttpResponse, Result,
};

use crate::{
    config::data::AppDataInner,
    model::dto::{LayerSearchParameters, PageParameters},
};
use crate::{model::dto::NewLayerDto, service::layer};

/// Endpoint for searching layers.
/// If no page parameters are provided, the first page is returned.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers",
    params(
        LayerSearchParameters,
        PageParameters
    ),
    responses(
        (status = 200, description = "Search layers", body = PageLayerDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("")]
pub async fn find(
    search_query: Query<LayerSearchParameters>,
    page_query: Query<PageParameters>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let response = layer::find(
        search_query.into_inner(),
        page_query.into_inner(),
        &app_data,
    )
    .await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for fetching a layer by its id.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers",
    responses(
        (status = 200, description = "Fetch layer by id", body = LayerDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[get("/{id}")]
pub async fn find_by_id(
    path: Path<(i32, i32)>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let (_, id) = path.into_inner();
    let response = layer::find_by_id(id, &app_data).await?;
    Ok(HttpResponse::Ok().json(response))
}

/// Endpoint for creating a new layer.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers",
    request_body = NewLayerDto,
    responses(
        (status = 201, description = "Create a plant layer", body = LayerDto)
    ),
    security(
        ("oauth2" = [])
    )
)]
#[post("")]
pub async fn create(
    new_layer: Json<NewLayerDto>,
    app_data: Data<AppDataInner>,
) -> Result<HttpResponse> {
    let dto = layer::create(new_layer.0, &app_data).await?;
    Ok(HttpResponse::Created().json(dto))
}

/// Endpoint for deleting a layer.
///
/// # Errors
/// * If the connection to the database could not be established.
#[utoipa::path(
    context_path = "/api/maps/{map_id}/layers",
    responses(
        (status = 200, description = "Delete a layer")
    ),
    security(
        ("oauth2" = [])
    )
)]
#[delete("/{id}")]
pub async fn delete(path: Path<(i32, i32)>, app_data: Data<AppDataInner>) -> Result<HttpResponse> {
    let (_, layer_id) = path.into_inner();
    layer::delete_by_id(layer_id, &app_data).await?;
    Ok(HttpResponse::Ok().finish())
}
