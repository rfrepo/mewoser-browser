export type AppIconName =
  | 'home'
  | 'retry'
  | 'trash'
  | 'upload'
  | 'voteUp'
  | 'gallery'
  | 'offline'
  | 'settings'
  | 'voteDown'
  | 'addPhoto'
  | 'discover'
  | 'favourite'
  | 'uploadCloud'
  | 'infoOutline'
  | 'errorOutline'
  | 'favouriteOutline'

export type IconConfig = {
  name: string
  library: 'material' | 'materialCommunity'
}