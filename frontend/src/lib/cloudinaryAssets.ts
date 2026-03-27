/**
 * CDN URLs (Cloudinary). Replace local /assets paths app-wide.
 */

export const HERO_VIDEO_URLS = [
  "https://res.cloudinary.com/dpl4npfny/video/upload/v1774540649/Srinu_Portfolio/videos/Hero/Hero_1_video_yrorx3.mp4",
  "https://res.cloudinary.com/dpl4npfny/video/upload/v1774540641/Srinu_Portfolio/videos/Hero/Hero_2_video_upyppj.mp4",
  "https://res.cloudinary.com/dpl4npfny/video/upload/v1774540646/Srinu_Portfolio/videos/Hero/Hero_3_video_muvcav.mp4",
  "https://res.cloudinary.com/dpl4npfny/video/upload/v1774540653/Srinu_Portfolio/videos/Hero/Hero_4_video_gugrby.mp4",
] as const;

/** Services section — video per offering (AboutPremiumSection labels). */
export const SERVICE_VIDEOS = {
  fashionPhotography:
    "https://res.cloudinary.com/dpl4npfny/video/upload/v1774546448/Srinu_Portfolio/videos/services/fashion_photo_rp7lxh.mp4",
  productPhotography:
    "https://res.cloudinary.com/dpl4npfny/video/upload/v1774546457/Srinu_Portfolio/videos/services/product_photography_hboocp.mp4",
  socialMediaContent:
    "https://res.cloudinary.com/dpl4npfny/video/upload/v1774546451/Srinu_Portfolio/videos/services/conten_creation_lxaqpd.mp4",
  creativeBrandCampaigns:
    "https://res.cloudinary.com/dpl4npfny/video/upload/v1774546444/Srinu_Portfolio/videos/services/campaign_po9rra.mp4",
} as const;

/** Scroll-sync / grid sections: order Photography → Videography → Makeup → Hairstyling (4 slots). */
export const SERVICE_VIDEOS_LEGACY_ORDER = [
  SERVICE_VIDEOS.fashionPhotography,
  SERVICE_VIDEOS.productPhotography,
  SERVICE_VIDEOS.socialMediaContent,
  SERVICE_VIDEOS.creativeBrandCampaigns,
] as const;

/** Video grid column order: Photography, Hairstyling, Videography, Makeup. */
export const SERVICE_VIDEOS_VIDEO_GRID_ORDER = [
  SERVICE_VIDEOS.fashionPhotography,
  SERVICE_VIDEOS.socialMediaContent,
  SERVICE_VIDEOS.productPhotography,
  SERVICE_VIDEOS.creativeBrandCampaigns,
] as const;

export const PORTFOLIO_1_IMAGE_URLS = [
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545805/Srinu_Portfolio/images/portfolio_1/port_1_1_sufglg.jpg",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545800/Srinu_Portfolio/images/portfolio_1/port_1_2_lpxtiu.jpg",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545802/Srinu_Portfolio/images/portfolio_1/port_1_3_m6qkvp.jpg",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545804/Srinu_Portfolio/images/portfolio_1/port_1_4_pgl9ph.jpg",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545794/Srinu_Portfolio/images/portfolio_1/port_1_5_q7thpm.jpg",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545799/Srinu_Portfolio/images/portfolio_1/port_1_6_rghlfa.jpg",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545796/Srinu_Portfolio/images/portfolio_1/port_1_7_npvyxt.jpg",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545793/Srinu_Portfolio/images/portfolio_1/port_1_8_ommlwn.jpg",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545797/Srinu_Portfolio/images/portfolio_1/port_1_9_lpitfz.jpg",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545807/Srinu_Portfolio/images/portfolio_1/port_1_10_xdasty.jpg",
] as const;

export const PORTFOLIO_2_VIDEO_URLS = [
  "https://res.cloudinary.com/dpl4npfny/video/upload/v1774546022/Srinu_Portfolio/videos/portfolio_2/port_2_1_s6xrtw.mp4",
  "https://res.cloudinary.com/dpl4npfny/video/upload/v1774546001/Srinu_Portfolio/videos/portfolio_2/port_2_2_iwpabr.mp4",
  "https://res.cloudinary.com/dpl4npfny/video/upload/v1774546026/Srinu_Portfolio/videos/portfolio_2/port_2_3_l19zkj.mp4",
  "https://res.cloudinary.com/dpl4npfny/video/upload/v1774546024/Srinu_Portfolio/videos/portfolio_2/port_2_4_q7eioe.mp4",
  "https://res.cloudinary.com/dpl4npfny/video/upload/v1774546008/Srinu_Portfolio/videos/portfolio_2/port_2_5_hc5vwt.mp4",
] as const;

export const BRAND_LOGO_URLS = [
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545939/Srinu_Portfolio/images/brands/brand_1_brehty.png",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545934/Srinu_Portfolio/images/brands/brand_2_pmsndd.png",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545937/Srinu_Portfolio/images/brands/brand_3_f6g4yk.png",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545936/Srinu_Portfolio/images/brands/brand_4_zpqvms.png",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545942/Srinu_Portfolio/images/brands/brand_5_av1w87.png",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545943/Srinu_Portfolio/images/brands/brand_6_rwofri.png",
] as const;

export const CURVE_IMAGE_URLS = [
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545681/Srinu_Portfolio/images/curved/curve_1_qbzdj4.jpg",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545671/Srinu_Portfolio/images/curved/curve_2_moffh1.jpg",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545673/Srinu_Portfolio/images/curved/curve_3_w6wafu.jpg",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545673/Srinu_Portfolio/images/curved/curve_4_pndflw.jpg",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545671/Srinu_Portfolio/images/curved/curve_5_hepx0t.jpg",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545670/Srinu_Portfolio/images/curved/curve_6_xyesik.jpg",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545669/Srinu_Portfolio/images/curved/curve_7_hxkg3m.jpg",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545668/Srinu_Portfolio/images/curved/curve_8_gbkefb.jpg",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545672/Srinu_Portfolio/images/curved/curve_9_bpcgac.jpg",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545679/Srinu_Portfolio/images/curved/curve_10_wyl8dn.jpg",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545676/Srinu_Portfolio/images/curved/curve_11_zmowz0.jpg",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545678/Srinu_Portfolio/images/curved/curve_12_gunxaq.jpg",
  "https://res.cloudinary.com/dpl4npfny/image/upload/v1774545674/Srinu_Portfolio/images/curved/curve_13_zs4egf.jpg",
] as const;
