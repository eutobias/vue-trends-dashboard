export interface LocationsResponse {
    locations: Location[];
}

export interface Location {
    id:                     number;
    name:                   string;
    location_name:          string;
    image:                  null | string;
    location_image:         null | string;
    primary_phone:          string;
    address:                null | string;
    city:                   null | string;
    state:                  null | string;
    zip:                    null | string;
    zip_code:               null | string;
    country:                null | string;
    email:                  null | string;
    description:            null | string;
    media_count:            number | null;
    is_connected:           number;
    status:                 null | string;
    location_state:         null | string;
    is_gmb_activate:        number;
    primary_category:       string;
    website_url:            null | string;
    place_id:               string;
    location_id:            string;
    created_at:             Date;
    updated_at:             Date;
    deleted_at:             null;
    latitude:               number;
    longitude:              number;
    subscription_id:        number;
    subscription_item_id:   number;
    review_count:           number;
    unreplied_review_count: number;
    last_review_date:       string;
    map_url:                null | string;
    review_link:            null | string;
    ave_review_rating:      number | null;
    deleted_from_google:    number;
    lock_changes:           number;
    is_authorized:          null;
    location_name_initials: string;
    review_url:             string;
    completion_percentage:  number | null;
}
