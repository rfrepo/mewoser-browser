import { AppIconName, IconConfig } from "./types";

export const iconMap: Record<AppIconName, IconConfig> = {
    home: { library: 'material', name: 'home' },
    retry: { library: 'material', name: 'refresh' },
    offline: { library: 'material', name: 'wifi-off' },
    gallery: { library: 'material', name: 'grid-view' },
    upload: { library: 'material', name: 'add-circle' },
    settings: { library: 'material', name: 'settings' },
    favourite: { library: 'material', name: 'favorite' },
    addPhoto: { library: 'material', name: 'add-a-photo' },
    trash: { library: 'material', name: 'delete-outline' },
    voteUp: { library: 'material', name: 'thumb-up-off-alt' },
    infoOutline: { library: 'material', name: 'info-outline' },
    discover: { library: 'materialCommunity', name: 'compass' },
    errorOutline: { library: 'material', name: 'error-outline' },
    voteDown: { library: 'material', name: 'thumb-down-off-alt' },
    favouriteOutline: { library: 'material', name: 'favorite-border' },
    uploadCloud: { library: 'materialCommunity', name: 'cloud-upload-outline' }
  } as const