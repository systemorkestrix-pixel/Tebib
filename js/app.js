import { createClient } from '@supabase/supabase-js';
import {
  BASE_SITE_SETTINGS,
  getPlatformHref,
  normalizeSiteSettings,
} from './site-settings.js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const ALL_CATEGORY_KEY = '__all__';
const DEFAULT_SITE_SETTINGS = { ...BASE_SITE_SETTINGS };
const VISIT_SESSION_KEY = 'ordely-site-visit-tracked-v1';

const SOCIAL_PLATFORMS = [
  { key: 'facebook_url', label: 'فيسبوك', className: 'facebook', icon: 'facebook' },
  { key: 'instagram_url', label: 'إنستغرام', className: 'instagram', icon: 'instagram' },
  { key: 'tiktok_url', label: 'تيك توك', className: 'tiktok', icon: 'tiktok' },
];

const ACTION_PLATFORMS = [
  { key: 'phone_number', label: 'اتصال', className: 'btn-call', icon: 'phone' },
  { key: 'whatsapp_url', label: 'واتساب', className: 'btn-whatsapp', icon: 'whatsapp' },
  { key: 'messenger_url', label: 'مسنجر', className: 'btn-messenger', icon: 'messenger' },
  { key: 'telegram_url', label: 'تلجرام', className: 'btn-telegram', icon: 'telegram' },
  { key: 'google_maps_url', label: 'الموقع', className: 'btn-map', icon: 'map' },
];

let categories = [];
let products = [];
let activeCategory = null;
let siteSettings = { ...DEFAULT_SITE_SETTINGS };
let currentOrderProduct = null;

const heroSection = document.getElementById('heroSection');
const categoryBar = document.querySelector('.category-bar');
const categoryContainer = document.getElementById('categoryContainer');
const productsContainer = document.getElementById('productsContainer');
const socialLinksContainer = document.getElementById('socialLinks');
const stickyBottomBar = document.getElementById('stickyBottomBar');
const serviceAreaBanner = document.getElementById('serviceAreaBanner');
const serviceAreaText = document.getElementById('serviceAreaText');
const siteToastStack = document.getElementById('siteToastStack');
const orderModal = document.getElementById('orderModal');
const btnCloseOrderModal = document.getElementById('btnCloseOrderModal');
const orderForm = document.getElementById('orderForm');
const orderProductIdInput = document.getElementById('orderProductId');
const orderProductName = document.getElementById('orderProductName');
const orderProductMeta = document.getElementById('orderProductMeta');
const orderCustomerName = document.getElementById('orderCustomerName');
const orderCustomerPhone = document.getElementById('orderCustomerPhone');
const orderQuantity = document.getElementById('orderQuantity');
const btnSubmitOrder = document.getElementById('btnSubmitOrder');

function getPlatformIcon(iconName) {
  switch (iconName) {
    case 'facebook':
      return `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13.5 21v-7h2.6l.4-3h-3V9.1c0-.9.3-1.6 1.7-1.6H16.7V4.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V11H8v3h2.5v7h3z" fill="currentColor"/>
        </svg>
      `;
    case 'instagram':
      return `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor"/>
        </svg>
      `;
    case 'tiktok':
      return `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14.2 4c.5 1.7 1.8 3 3.5 3.5v2.8c-1.3 0-2.5-.4-3.5-1v5.2a4.5 4.5 0 1 1-4.5-4.5c.3 0 .7 0 1 .1v2.9a2 2 0 1 0 1 1.7V4h2.5z" fill="currentColor"/>
        </svg>
      `;
    case 'telegram':
      return `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.7 4.5 3.8 11c-.8.3-.8 1.4.1 1.6l4.3 1.3 1.6 4.8c.2.7 1.1.9 1.6.3l2.4-2.9 4.8 3.5c.7.5 1.7.1 1.9-.8l2.6-12.4c.2-1-.8-1.8-1.7-1.4ZM9.3 13.4l8-5.1-6.3 6.8-.3 2.8-1.4-4.5Z" fill="currentColor"/>
        </svg>
      `;
    case 'whatsapp':
      return `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.5-1.2A8.5 8.5 0 1 0 12 3.5Zm0 14.8c-1.2 0-2.3-.3-3.3-.9l-.2-.1-2.7.7.7-2.6-.2-.2A6.8 6.8 0 1 1 12 18.3Zm3.8-5.1c-.2-.1-1.1-.5-1.3-.6-.2-.1-.3-.1-.5.1l-.4.6c-.1.2-.3.2-.5.1-.7-.3-2.1-1.3-2.5-2.2-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.3 0-.5l-.6-1.3c-.1-.2-.3-.2-.5-.2h-.4c-.2 0-.4.1-.5.3-.2.3-.6.8-.6 1.8s.7 2.1.8 2.2c.1.1 1.4 2.2 3.5 3 .5.2 1 .4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.1-.4 1.3-.9.2-.5.2-1 .1-1.1-.1-.1-.3-.1-.5-.2Z" fill="currentColor"/>
        </svg>
      `;
    case 'messenger':
      return `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 4.2c-4.5 0-8.1 3.3-8.1 7.4 0 2.3 1.1 4.4 3 5.8v2.8l2.7-1.5c.7.2 1.5.3 2.4.3 4.5 0 8.1-3.3 8.1-7.4S16.5 4.2 12 4.2Zm.8 9.8-2.1-2.3-4.1 2.3 4.6-4.9 2.1 2.3 4.1-2.3-4.6 4.9Z" fill="currentColor"/>
        </svg>
      `;
    case 'phone':
      return `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6.7 4.8c.4-.4 1-.6 1.6-.4l2.2.7c.7.2 1.1.9 1 1.6l-.2 2.1c0 .4.1.8.4 1.1l2.3 2.3c.3.3.7.5 1.1.4l2.1-.2c.7-.1 1.4.3 1.6 1l.7 2.2c.2.6 0 1.2-.4 1.6l-1 1c-.7.7-1.8 1-2.8.8-2.2-.5-4.4-1.7-6.3-3.7-1.9-1.9-3.2-4.1-3.7-6.3-.2-1 .1-2.1.8-2.8l1-1Z" fill="currentColor"/>
        </svg>
      `;
    case 'map':
      return `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21s6-5.7 6-11a6 6 0 1 0-12 0c0 5.3 6 11 6 11Zm0-8.2a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6Z" fill="currentColor"/>
        </svg>
      `;
    default:
      return '';
  }
}

function createIconSpan(iconName) {
  const iconSpan = document.createElement('span');
  iconSpan.className = 'platform-icon';
  iconSpan.setAttribute('aria-hidden', 'true');
  iconSpan.innerHTML = getPlatformIcon(iconName);
  return iconSpan;
}

function isMissingOrderIndexError(error) {
  const message = String(error?.message || error?.details || '').toLowerCase();
  return message.includes('order_index') && message.includes('column');
}

function isMissingSiteSettingsError(error) {
  const message = String(error?.message || error?.details || '').toLowerCase();
  return message.includes('site_settings') && (
    message.includes('schema cache')
    || message.includes('does not exist')
    || message.includes('relation')
  );
}

function formatPrice(value) {
  const parsedValue = Number(value) || 0;
  return `${parsedValue} د.ج`;
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  const toastTitle = document.createElement('strong');
  const toastMessage = document.createElement('p');

  toast.className = `site-toast site-toast-${type}`;
  toastTitle.textContent = type === 'error' ? 'تعذر التنفيذ' : 'تم بنجاح';
  toastMessage.textContent = message;

  toast.append(toastTitle, toastMessage);
  siteToastStack.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 3200);
}

function applyHeroSettings() {
  heroSection.style.backgroundImage = siteSettings.hero_image_url
    ? `url("${siteSettings.hero_image_url}")`
    : 'none';
}

function renderServiceArea() {
  const locationParts = [siteSettings.service_country, siteSettings.service_region].filter(Boolean);

  if (!locationParts.length) {
    serviceAreaBanner.hidden = true;
    serviceAreaText.textContent = '';
    return;
  }

  serviceAreaBanner.hidden = false;
  serviceAreaText.textContent = `الخدمة متاحة حاليًا داخل ${locationParts.join(' - ')} فقط. لا يوجد توصيل خارج هذا النطاق حاليًا.`;
}

function renderSocialLinks() {
  socialLinksContainer.replaceChildren();

  const visiblePlatforms = SOCIAL_PLATFORMS
    .map((platform) => ({
      ...platform,
      href: getPlatformHref(platform.key, siteSettings[platform.key]),
    }))
    .filter((platform) => platform.href);

  if (visiblePlatforms.length === 0) {
    socialLinksContainer.hidden = true;
    return;
  }

  visiblePlatforms.forEach((platform) => {
    const link = document.createElement('a');
    link.href = platform.href;
    link.className = `social-link social-link-${platform.className}`;
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', platform.label);
    link.title = platform.label;
    link.appendChild(createIconSpan(platform.icon));
    socialLinksContainer.appendChild(link);
  });

  socialLinksContainer.hidden = false;
}

function renderActionButtons() {
  stickyBottomBar.replaceChildren();

  const actions = ACTION_PLATFORMS
    .map((platform) => {
      const href = getPlatformHref(platform.key, siteSettings[platform.key]);
      if (!href) {
        return null;
      }

      return {
        href,
        label: platform.label,
        className: platform.className,
        icon: platform.icon,
        external: platform.key !== 'phone_number',
      };
    })
    .filter(Boolean);

  document.body.classList.toggle('has-sticky-actions', actions.length > 0);

  if (actions.length === 0) {
    stickyBottomBar.hidden = true;
    return;
  }

  actions.forEach((action) => {
    const link = document.createElement('a');
    link.href = action.href;
    link.className = `btn ${action.className}`;
    link.setAttribute('aria-label', action.label);
    link.title = action.label;
    if (action.external) {
      link.target = '_blank';
      link.rel = 'noopener';
    }

    link.appendChild(createIconSpan(action.icon));
    stickyBottomBar.appendChild(link);
  });

  stickyBottomBar.hidden = false;
}

function renderCategories() {
  categoryContainer.replaceChildren();

  if (!categories.length) {
    categoryBar.hidden = true;
    return;
  }

  categoryBar.hidden = false;

  const categoryItems = [
    { id: ALL_CATEGORY_KEY, name: 'الكل', icon: '🍽️' },
    ...categories,
  ];

  categoryItems.forEach((category) => {
    const categoryValue = category.id === ALL_CATEGORY_KEY ? ALL_CATEGORY_KEY : category.name;
    const el = document.createElement('div');
    const icon = document.createElement('div');
    const label = document.createElement('span');

    el.className = `category-item ${categoryValue === activeCategory ? 'active' : ''}`;
    el.addEventListener('click', () => {
      activeCategory = categoryValue;
      document.querySelectorAll('.category-item').forEach((node) => node.classList.remove('active'));
      el.classList.add('active');
      renderProducts();
    });

    icon.className = 'category-icon';
    icon.textContent = category.icon || '🍽️';

    label.className = 'category-label';
    label.textContent = category.name;

    el.append(icon, label);
    categoryContainer.appendChild(el);
  });
}

function buildProductCard(product) {
  const card = document.createElement('div');
  const imageWrap = document.createElement('div');
  const priceBadge = document.createElement('div');
  const info = document.createElement('div');
  const title = document.createElement('h3');

  card.className = 'product-card';
  imageWrap.className = 'product-image-wrap';
  priceBadge.className = 'product-price-badge';
  priceBadge.textContent = formatPrice(product.price);
  info.className = 'product-info';
  title.className = 'product-name';
  title.textContent = product.name;

  if (product.image_url) {
    const image = document.createElement('img');
    image.className = 'product-image';
    image.src = product.image_url;
    image.alt = product.name;
    image.loading = 'lazy';
    imageWrap.appendChild(image);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'product-image-placeholder';
    placeholder.textContent = 'بدون صورة';
    imageWrap.appendChild(placeholder);
  }

  imageWrap.prepend(priceBadge);
  info.appendChild(title);

  if (siteSettings.orders_enabled) {
    const orderButton = document.createElement('button');
    orderButton.type = 'button';
    orderButton.className = 'btn product-order-btn';
    orderButton.textContent = 'اطلب الآن';
    orderButton.addEventListener('click', () => {
      openOrderModal(product.id);
    });
    info.appendChild(orderButton);
  }

  card.append(imageWrap, info);
  return card;
}

function renderProducts() {
  productsContainer.replaceChildren();

  const filtered = activeCategory && activeCategory !== ALL_CATEGORY_KEY
    ? products.filter((product) => product.category === activeCategory)
    : products;

  if (filtered.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.textContent = activeCategory && activeCategory !== ALL_CATEGORY_KEY
      ? 'لا توجد منتجات في هذا التصنيف حاليًا.'
      : 'لا توجد منتجات متاحة حاليًا.';
    productsContainer.appendChild(emptyState);
    return;
  }

  filtered.forEach((product) => {
    productsContainer.appendChild(buildProductCard(product));
  });
}

function openOrderModal(productId) {
  const product = products.find((item) => String(item.id) === String(productId));
  if (!product || !siteSettings.orders_enabled) {
    return;
  }

  currentOrderProduct = product;
  orderProductIdInput.value = String(product.id);
  orderProductName.textContent = product.name;
  orderProductMeta.textContent = `${formatPrice(product.price)} • ${product.category}`;
  orderQuantity.value = '1';
  orderModal.classList.remove('hidden');
  orderModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('order-modal-open');
  window.requestAnimationFrame(() => {
    orderCustomerName.focus();
  });

  if (hasSupabaseConfig) {
    supabase.rpc('track_product_click', { target_product_id: product.id }).catch((error) => {
      console.error('Error tracking product click:', error);
    });
  }
}

function closeOrderModal({ reset = false } = {}) {
  orderModal.classList.add('hidden');
  orderModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('order-modal-open');

  if (reset) {
    orderForm.reset();
    orderQuantity.value = '1';
    currentOrderProduct = null;
    orderProductIdInput.value = '';
  }
}

async function trackSiteVisitOnce() {
  if (!hasSupabaseConfig || window.sessionStorage.getItem(VISIT_SESSION_KEY)) {
    return;
  }

  await supabase.rpc('track_site_visit');
  window.sessionStorage.setItem(VISIT_SESSION_KEY, '1');
}

async function loadData() {
  try {
    if (!hasSupabaseConfig) {
      siteSettings = normalizeSiteSettings(DEFAULT_SITE_SETTINGS);
      categories = [];
      products = [];
    } else {
      const settingsPromise = supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      let categoriesPromise = supabase
        .from('categories')
        .select('*')
        .order('order_index');

      const productsPromise = supabase
        .from('products')
        .select('*')
        .eq('is_available', true);

      let [settingsRes, catRes, prodRes] = await Promise.all([
        settingsPromise,
        categoriesPromise,
        productsPromise,
      ]);

      if (catRes.error && isMissingOrderIndexError(catRes.error)) {
        catRes = await supabase.from('categories').select('*');
      }

      if (settingsRes.error && !isMissingSiteSettingsError(settingsRes.error)) {
        throw settingsRes.error;
      }

      if (catRes.error) {
        throw catRes.error;
      }

      if (prodRes.error) {
        throw prodRes.error;
      }

      categories = catRes.data || [];
      products = prodRes.data || [];
      siteSettings = settingsRes.error && isMissingSiteSettingsError(settingsRes.error)
        ? normalizeSiteSettings(DEFAULT_SITE_SETTINGS)
        : normalizeSiteSettings(settingsRes.data || DEFAULT_SITE_SETTINGS);
    }
  } catch (error) {
    console.error('Error loading data:', error);
    siteSettings = normalizeSiteSettings(DEFAULT_SITE_SETTINGS);
    categories = [];
    products = [];
  }

  activeCategory = categories.length ? ALL_CATEGORY_KEY : null;
  applyHeroSettings();
  renderServiceArea();
  renderSocialLinks();
  renderActionButtons();
  renderCategories();
  renderProducts();
}

orderModal.addEventListener('click', (event) => {
  if (event.target.dataset.closeOrderModal === 'true') {
    closeOrderModal();
  }
});

btnCloseOrderModal.addEventListener('click', () => {
  closeOrderModal();
});

orderForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!hasSupabaseConfig || !siteSettings.orders_enabled || !currentOrderProduct) {
    showToast('تعذر إرسال الطلب الآن. حاول مرة أخرى.', 'error');
    return;
  }

  const customerName = orderCustomerName.value.trim();
  const customerPhone = orderCustomerPhone.value.trim();
  const quantityValue = Number.parseInt(orderQuantity.value, 10);

  if (!customerName || !customerPhone || Number.isNaN(quantityValue) || quantityValue < 1) {
    showToast('أكمل المعلومات المطلوبة قبل تأكيد الطلب.', 'error');
    return;
  }

  const defaultButtonLabel = 'تأكيد الطلب';
  btnSubmitOrder.disabled = true;
  btnSubmitOrder.textContent = 'جارٍ إرسال الطلب...';

  try {
    const { error } = await supabase.rpc('create_order', {
      target_product_id: currentOrderProduct.id,
      customer_name_input: customerName,
      customer_phone_input: customerPhone,
      order_quantity: quantityValue,
    });

    if (error) {
      throw error;
    }

    showToast(`تم إرسال طلب ${currentOrderProduct.name} بنجاح.`);
    closeOrderModal({ reset: true });
  } catch (error) {
    console.error('Error creating order:', error);
    showToast('تعذر إرسال الطلب الآن. حاول مرة أخرى.', 'error');
  } finally {
    btnSubmitOrder.disabled = false;
    btnSubmitOrder.textContent = defaultButtonLabel;
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !orderModal.classList.contains('hidden')) {
    closeOrderModal();
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  trackSiteVisitOnce().catch((error) => {
    console.error('Error tracking site visit:', error);
  });
});
