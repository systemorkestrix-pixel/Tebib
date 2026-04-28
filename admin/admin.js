import { createClient } from '@supabase/supabase-js';
import {
  BASE_SITE_SETTINGS,
  normalizeSiteSettings,
  normalizeUrl,
} from '../js/site-settings.js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const SITE_SETTINGS_ID = 'default';
const DEFAULT_CATEGORY_ICON = '🍽️';

const TEXT = {
  unknownSupabaseError: 'حدث خطأ غير متوقع. حاول مرة أخرى.',
  chooseCategory: 'اختر التصنيف',
  addCategoryFirst: 'أضف تصنيفًا أولًا',
  noCategoriesAvailable: 'لا توجد تصنيفات متاحة',
  noProductsYet: 'لا توجد منتجات مضافة حتى الآن.',
  noCategoriesYet: 'لا توجد تصنيفات مضافة حتى الآن.',
  noOrdersYet: 'لا توجد طلبات واردة حتى الآن.',
  available: 'متوفر',
  unavailable: 'غير متوفر',
  edit: 'تعديل',
  delete: 'حذف',
  activate: 'تفعيل',
  disable: 'تعطيل',
  process: 'معالجة',
  complete: 'إكمال',
  cancelOrder: 'إلغاء الطلب',
  none: 'لا يوجد',
  addProduct: 'إضافة منتج',
  saveChanges: 'حفظ التعديلات',
  addProductTitle: 'إضافة منتج',
  editProductTitle: 'تعديل المنتج',
  addProductSubtitle: 'أدخل بيانات المنتج ثم احفظه ليظهر في القائمة.',
  editProductSubtitle: 'حدّث بيانات المنتج ثم احفظ التغييرات.',
  addCategory: 'إضافة تصنيف',
  addCategoryTitle: 'إضافة تصنيف',
  editCategoryTitle: 'تعديل التصنيف',
  addCategorySubtitle: 'أدخل بيانات التصنيف ثم احفظه ليظهر في القائمة.',
  editCategorySubtitle: 'حدّث بيانات التصنيف ثم احفظ التغييرات.',
  saveCategory: 'حفظ التصنيف',
  saveSettings: 'حفظ التغييرات',
  loadingSave: 'جارٍ الحفظ...',
  dashboardLoadError: 'تعذر تحميل البيانات الآن. حاول مرة أخرى.',
  loginFailed: 'تعذر تسجيل الدخول. تأكد من البريد الإلكتروني وكلمة المرور ثم حاول مرة أخرى.',
  confirmDeleteProduct: 'هل أنت متأكد من حذف هذا المنتج؟',
  deleteProductError: 'تعذر حذف المنتج الآن. حاول مرة أخرى.',
  deleteCategoryError: 'تعذر حذف التصنيف الآن. حاول مرة أخرى.',
  saveProductError: 'تعذر حفظ المنتج الآن. حاول مرة أخرى.',
  saveCategoryError: 'تعذر حفظ التصنيف الآن. حاول مرة أخرى.',
  saveSettingsError: 'تعذر حفظ التغييرات الآن. حاول مرة أخرى.',
  categoryNameRequired: 'اسم التصنيف مطلوب.',
  duplicateCategory: 'يوجد تصنيف آخر بالاسم نفسه.',
  settingsSaved: 'تم حفظ التغييرات بنجاح.',
  productSaved: 'تم حفظ المنتج بنجاح.',
  categorySaved: 'تم حفظ التصنيف بنجاح.',
  productDeleted: 'تم حذف المنتج.',
  categoryDeleted: 'تم حذف التصنيف.',
  availabilityEnabled: 'تم تفعيل المنتج.',
  availabilityDisabled: 'تم تعطيل المنتج.',
  orderUpdated: 'تم تحديث حالة الطلب.',
  toastSuccess: 'تم بنجاح',
  toastError: 'حدث خطأ',
  toastWarning: 'تنبيه',
  toastInfo: 'معلومة',
  cancel: 'إلغاء',
  confirmAction: 'متابعة',
  confirmTitle: 'تأكيد العملية',
  fileNotSelected: 'لم يتم اختيار ملف',
  supabaseRequired: 'أكمل ربط Supabase أولًا لبدء استخدام اللوحة.',
  cannotDeleteCategory(categoryName, usageCount) {
    return `لا يمكن حذف التصنيف "${categoryName}" لأنه مستخدم في ${usageCount} منتج. انقل هذه المنتجات إلى تصنيف آخر أولًا.`;
  },
  confirmDeleteCategory(categoryName) {
    return `هل أنت متأكد من حذف التصنيف "${categoryName}"؟`;
  },
  orderStatusLabel(status) {
    if (status === 'processing') {
      return 'قيد المعالجة';
    }

    if (status === 'completed') {
      return 'مكتمل';
    }

    if (status === 'cancelled') {
      return 'ملغي';
    }

    return 'جديد';
  },
};

const DEFAULT_SITE_SETTINGS = {
  id: SITE_SETTINGS_ID,
  ...BASE_SITE_SETTINGS,
};

const authSection = document.getElementById('authSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');
const btnOrdersInbox = document.getElementById('btnOrdersInbox');
const newOrdersBadge = document.getElementById('newOrdersBadge');
const loginError = document.getElementById('loginError');

const productForm = document.getElementById('productForm');
const prodIdInput = document.getElementById('prodId');
const prodName = document.getElementById('prodName');
const prodPrice = document.getElementById('prodPrice');
const prodCategory = document.getElementById('prodCategory');
const prodImage = document.getElementById('prodImage');
const prodImageName = document.getElementById('prodImageName');
const currentImgUrl = document.getElementById('currentImgUrl');
const productCategoryHint = document.getElementById('productCategoryHint');
const btnSaveProduct = document.getElementById('btnSaveProduct');
const btnCancelEdit = document.getElementById('btnCancelEdit');
const btnOpenProductEditor = document.getElementById('btnOpenProductEditor');
const btnCloseProductEditor = document.getElementById('btnCloseProductEditor');
const productEditorShell = document.getElementById('productEditorShell');
const productEditorSurface = productEditorShell.querySelector('.product-editor-surface');
const productEditorTitle = document.getElementById('productEditorTitle');
const productEditorSubtitle = document.getElementById('productEditorSubtitle');

const categoryForm = document.getElementById('categoryForm');
const catIdInput = document.getElementById('catId');
const catNameInput = document.getElementById('catName');
const catIconInput = document.getElementById('catIcon');
const catOrderInput = document.getElementById('catOrder');
const btnSaveCategory = document.getElementById('btnSaveCategory');
const btnCancelCategoryEdit = document.getElementById('btnCancelCategoryEdit');
const btnOpenCategoryEditor = document.getElementById('btnOpenCategoryEditor');
const btnCloseCategoryEditor = document.getElementById('btnCloseCategoryEditor');
const categoryEditorShell = document.getElementById('categoryEditorShell');
const categoryEditorSurface = categoryEditorShell.querySelector('.category-editor-surface');
const categoryEditorTitle = document.getElementById('categoryEditorTitle');
const categoryEditorSubtitle = document.getElementById('categoryEditorSubtitle');

const settingsForm = document.getElementById('settingsForm');
const heroImageUrlInput = document.getElementById('heroImageUrl');
const heroImageFileInput = document.getElementById('heroImageFile');
const heroImageFileName = document.getElementById('heroImageFileName');
const heroPreviewImage = document.getElementById('heroPreviewImage');
const sitePhoneNumberInput = document.getElementById('sitePhoneNumber');
const googleMapsUrlInput = document.getElementById('googleMapsUrl');
const whatsappUrlInput = document.getElementById('whatsappUrl');
const messengerUrlInput = document.getElementById('messengerUrl');
const telegramUrlInput = document.getElementById('telegramUrl');
const facebookUrlInput = document.getElementById('facebookUrl');
const instagramUrlInput = document.getElementById('instagramUrl');
const tiktokUrlInput = document.getElementById('tiktokUrl');
const ordersEnabledInput = document.getElementById('ordersEnabled');
const serviceCountryInput = document.getElementById('serviceCountry');
const serviceRegionInput = document.getElementById('serviceRegion');
const btnSaveSettings = document.getElementById('btnSaveSettings');

const productsTableBody = document.getElementById('productsTableBody');
const categoriesTableBody = document.getElementById('categoriesTableBody');
const ordersTableBody = document.getElementById('ordersTableBody');
const tabs = Array.from(document.querySelectorAll('.tab'));
const summaryNewOrders = document.getElementById('summaryNewOrders');
const summaryTotalOrders = document.getElementById('summaryTotalOrders');
const summarySiteVisits = document.getElementById('summarySiteVisits');
const adminToastStack = document.getElementById('adminToastStack');
const adminConfirmModal = document.getElementById('adminConfirmModal');
const adminConfirmTitle = document.getElementById('adminConfirmTitle');
const adminConfirmMessage = document.getElementById('adminConfirmMessage');
const btnConfirmCancel = document.getElementById('btnConfirmCancel');
const btnConfirmAccept = document.getElementById('btnConfirmAccept');

let currentSession = null;
let categories = [];
let products = [];
let orders = [];
let siteStats = { total_visits: 0 };
let siteSettings = { ...DEFAULT_SITE_SETTINGS };
let editingProduct = null;
let editingCategory = null;
let confirmResolver = null;
let dashboardRefreshTimer = null;
let loginCooldownTimer = null;
let failedLoginAttempts = 0;
let isProductFormDirty = false;
let isCategoryFormDirty = false;
let isSettingsFormDirty = false;

const LOGIN_COOLDOWN_MS = 60_000;
const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCK_STORAGE_KEY = 'ordely_admin_login_lock_until';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderIcon(iconId) {
  return `<svg class="ui-icon" aria-hidden="true"><use href="#icon-${iconId}"></use></svg>`;
}

function renderButtonContent(label, iconId) {
  return `
    <span class="btn-content">
      ${renderIcon(iconId)}
      <span>${escapeHtml(label)}</span>
    </span>
  `;
}

function renderTableActionButton({
  action,
  label,
  icon,
  className = '',
  id = '',
  nextStatus = '',
}) {
  const actionClassName = ['btn', 'btn-small', className].filter(Boolean).join(' ');
  const statusAttribute = nextStatus ? ` data-next-status="${escapeHtml(nextStatus)}"` : '';

  return `
    <button type="button" class="${actionClassName}" data-action="${escapeHtml(action)}" data-id="${escapeHtml(String(id))}"${statusAttribute}>
      ${renderButtonContent(label, icon)}
    </button>
  `;
}

function setButtonContent(button, label, iconId) {
  button.innerHTML = renderButtonContent(label, iconId);
}

function formatCount(value) {
  return Intl.NumberFormat('ar-DZ').format(Number(value) || 0);
}

function formatDateTime(value) {
  if (!value) {
    return TEXT.none;
  }

  const dateValue = new Date(value);
  if (Number.isNaN(dateValue.getTime())) {
    return TEXT.none;
  }

  return new Intl.DateTimeFormat('ar-DZ', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(dateValue);
}

function markProductFormDirty() {
  if (editingProduct || productEditorShell.getAttribute('aria-hidden') === 'false') {
    isProductFormDirty = true;
  }
}

function markCategoryFormDirty() {
  if (editingCategory || categoryEditorShell.getAttribute('aria-hidden') === 'false') {
    isCategoryFormDirty = true;
  }
}

function markSettingsFormDirty() {
  isSettingsFormDirty = true;
}

function isProductEditorLocked() {
  return productEditorShell.getAttribute('aria-hidden') === 'false' || isProductFormDirty;
}

function isCategoryEditorLocked() {
  return categoryEditorShell.getAttribute('aria-hidden') === 'false' || isCategoryFormDirty;
}

function isSettingsLocked() {
  return isSettingsFormDirty;
}

function getToastTitle(type) {
  if (type === 'success') {
    return TEXT.toastSuccess;
  }

  if (type === 'error') {
    return TEXT.toastError;
  }

  if (type === 'warning') {
    return TEXT.toastWarning;
  }

  return TEXT.toastInfo;
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `admin-toast admin-toast-${type}`;
  toast.innerHTML = `
    <div class="admin-toast-title">${escapeHtml(getToastTitle(type))}</div>
    <p class="admin-toast-message">${escapeHtml(message)}</p>
  `;

  adminToastStack.appendChild(toast);
  window.setTimeout(() => {
    toast.remove();
  }, 3600);
}

function showSuccess(message) {
  showToast(message, 'success');
}

function showError(message) {
  showToast(message, 'error');
}

function showWarning(message) {
  showToast(message, 'warning');
}

function setLoginButtonState({ disabled = false, label = 'دخول', icon = 'login' } = {}) {
  btnLogin.disabled = disabled;
  setButtonContent(btnLogin, label, icon);
}

function clearLoginFeedback() {
  loginError.textContent = '';
  loginError.style.display = 'none';
}

function getStoredLoginLockUntil() {
  const storedValue = Number(window.localStorage.getItem(LOGIN_LOCK_STORAGE_KEY) || 0);
  return Number.isFinite(storedValue) ? storedValue : 0;
}

function setStoredLoginLockUntil(timestamp) {
  window.localStorage.setItem(LOGIN_LOCK_STORAGE_KEY, String(timestamp));
}

function clearStoredLoginLockUntil() {
  window.localStorage.removeItem(LOGIN_LOCK_STORAGE_KEY);
}

function showLoginFeedback(message) {
  loginError.textContent = message;
  loginError.style.display = 'block';
}

function stopLoginCooldownTimer() {
  if (!loginCooldownTimer) {
    return;
  }

  window.clearInterval(loginCooldownTimer);
  loginCooldownTimer = null;
}

function resetLoginProtection() {
  failedLoginAttempts = 0;
  stopLoginCooldownTimer();
  clearStoredLoginLockUntil();
  clearLoginFeedback();
  emailInput.disabled = false;
  passwordInput.disabled = false;
  setLoginButtonState({ disabled: false, label: 'دخول', icon: 'login' });
}

function startLoginCooldown(cooldownEndsAt = Date.now() + LOGIN_COOLDOWN_MS) {
  setStoredLoginLockUntil(cooldownEndsAt);
  emailInput.disabled = true;
  passwordInput.disabled = true;

  const tick = () => {
    const remainingMs = cooldownEndsAt - Date.now();
    if (remainingMs <= 0) {
      resetLoginProtection();
      return;
    }

    const remainingSeconds = Math.ceil(remainingMs / 1000);
    showLoginFeedback(`تم إيقاف المحاولات مؤقتًا. أعد المحاولة بعد ${remainingSeconds} ثانية.`);
    setLoginButtonState({ disabled: true, label: `انتظار ${remainingSeconds}s`, icon: 'lock' });
  };

  stopLoginCooldownTimer();
  tick();
  loginCooldownTimer = window.setInterval(tick, 1000);
}

function updateFileInputName(input, label) {
  const file = input.files?.[0];
  label.textContent = file ? file.name : TEXT.fileNotSelected;
}

function closeConfirmModal(result = false) {
  if (!confirmResolver) {
    return;
  }

  const resolve = confirmResolver;
  confirmResolver = null;
  adminConfirmModal.classList.add('hidden');
  adminConfirmModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('admin-confirm-open');
  resolve(result);
}

function askConfirmation({
  title = TEXT.confirmTitle,
  message,
  confirmLabel = TEXT.confirmAction,
  tone = 'danger',
} = {}) {
  return new Promise((resolve) => {
    if (confirmResolver) {
      closeConfirmModal(false);
    }

    confirmResolver = resolve;
    adminConfirmTitle.textContent = title;
    adminConfirmMessage.textContent = message;
    btnConfirmCancel.textContent = TEXT.cancel;
    btnConfirmAccept.textContent = confirmLabel;
    btnConfirmAccept.dataset.tone = tone;
    adminConfirmModal.classList.remove('hidden');
    adminConfirmModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('admin-confirm-open');
  });
}

function applyStaticButtonLabels() {
  setLoginButtonState({ disabled: false, label: 'دخول', icon: 'login' });
  setButtonContent(btnSaveProduct, TEXT.addProduct, 'plus');
  setButtonContent(btnCancelEdit, TEXT.cancel, 'close');
  setButtonContent(btnSaveCategory, TEXT.addCategory, 'plus');
  setButtonContent(btnCancelCategoryEdit, TEXT.cancel, 'close');
  setButtonContent(btnSaveSettings, TEXT.saveSettings, 'save');
}

function sortCategories(list) {
  return [...list].sort((first, second) => {
    const firstOrder = Number(first.order_index) || 0;
    const secondOrder = Number(second.order_index) || 0;
    if (firstOrder !== secondOrder) {
      return firstOrder - secondOrder;
    }

    return String(first.name || '').localeCompare(String(second.name || ''), 'ar');
  });
}

function getNextCategoryOrder() {
  if (!categories.length) {
    return 1;
  }

  return Math.max(...categories.map((category) => Number(category.order_index) || 0)) + 1;
}

function normalizeOrderValue(value) {
  const parsedValue = Number.parseInt(value, 10);
  if (Number.isNaN(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return parsedValue;
}

function normalizeAdminSiteSettings(value) {
  return {
    id: SITE_SETTINGS_ID,
    ...normalizeSiteSettings({
      ...DEFAULT_SITE_SETTINGS,
      ...value,
    }),
  };
}

function getSupabaseErrorMessage(error) {
  if (!error) {
    return TEXT.unknownSupabaseError;
  }

  return error.message || error.details || error.hint || TEXT.unknownSupabaseError;
}

function isMissingColumnError(error, columnName) {
  const message = getSupabaseErrorMessage(error).toLowerCase();
  return message.includes(columnName.toLowerCase()) && message.includes('column');
}

function isMissingSiteSettingsError(error) {
  const message = getSupabaseErrorMessage(error).toLowerCase();
  return message.includes('site_settings') && (
    message.includes('schema cache')
    || message.includes('does not exist')
    || message.includes('relation')
  );
}

function normalizeCategoryIcon(value) {
  const icon = String(value || '').trim();
  return icon || DEFAULT_CATEGORY_ICON;
}

function updateHeroPreview(imageUrl) {
  const nextImageUrl = String(imageUrl || '').trim();
  if (!nextImageUrl) {
    heroPreviewImage.removeAttribute('src');
    heroPreviewImage.hidden = true;
    return;
  }

  heroPreviewImage.src = nextImageUrl;
  heroPreviewImage.hidden = false;
}

function applySiteSettingsToForm() {
  heroImageUrlInput.value = siteSettings.hero_image_url || '';
  heroImageFileInput.value = '';
  updateFileInputName(heroImageFileInput, heroImageFileName);
  sitePhoneNumberInput.value = siteSettings.phone_number || '';
  googleMapsUrlInput.value = siteSettings.google_maps_url || '';
  whatsappUrlInput.value = siteSettings.whatsapp_url || '';
  messengerUrlInput.value = siteSettings.messenger_url || '';
  telegramUrlInput.value = siteSettings.telegram_url || '';
  facebookUrlInput.value = siteSettings.facebook_url || '';
  instagramUrlInput.value = siteSettings.instagram_url || '';
  tiktokUrlInput.value = siteSettings.tiktok_url || '';
  ordersEnabledInput.checked = Boolean(siteSettings.orders_enabled);
  serviceCountryInput.value = siteSettings.service_country || '';
  serviceRegionInput.value = siteSettings.service_region || '';
  updateHeroPreview(siteSettings.hero_image_url);
  isSettingsFormDirty = false;
}

async function uploadImageToStorage(file, folderName) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folderName}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(fileName, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from('images').getPublicUrl(fileName);
  return data.publicUrl;
}

async function fetchCategoriesFromSupabase() {
  let result = await supabase.from('categories').select('*').order('order_index');

  if (result.error && isMissingColumnError(result.error, 'order_index')) {
    result = await supabase.from('categories').select('*');
  }

  return result;
}

async function fetchSiteSettingsFromSupabase() {
  const result = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', SITE_SETTINGS_ID)
    .maybeSingle();

  if (result.error) {
    if (isMissingSiteSettingsError(result.error)) {
      return normalizeAdminSiteSettings(DEFAULT_SITE_SETTINGS);
    }

    throw result.error;
  }

  return normalizeAdminSiteSettings(result.data || DEFAULT_SITE_SETTINGS);
}

async function fetchOrdersFromSupabase() {
  return supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
}

async function fetchSiteStatsFromSupabase() {
  const result = await supabase
    .from('site_stats')
    .select('*')
    .eq('id', 'global')
    .maybeSingle();

  if (result.error) {
    throw result.error;
  }

  return result.data || { total_visits: 0 };
}

async function runCategoryWrite(writeOperation, payload) {
  const nextPayload = { ...payload };
  let result = await writeOperation(nextPayload);

  while (result.error) {
    let handled = false;

    if (nextPayload.order_index !== undefined && isMissingColumnError(result.error, 'order_index')) {
      delete nextPayload.order_index;
      handled = true;
    }

    if (nextPayload.icon !== undefined && isMissingColumnError(result.error, 'icon')) {
      delete nextPayload.icon;
      handled = true;
    }

    if (!handled) {
      break;
    }

    result = await writeOperation(nextPayload);
  }

  return result;
}

async function insertCategoryIntoSupabase(categoryName, orderIndex, icon) {
  return runCategoryWrite(
    (payload) => supabase.from('categories').insert([payload]),
    { name: categoryName, order_index: orderIndex, icon },
  );
}

async function updateCategoryInSupabase(categoryId, categoryName, orderIndex, icon) {
  return runCategoryWrite(
    (payload) => supabase.from('categories').update(payload).eq('id', categoryId),
    { name: categoryName, order_index: orderIndex, icon },
  );
}

function getCategoryUsageCount(categoryName) {
  return products.filter((product) => product.category === categoryName).length;
}

function updateProductFormState() {
  const hasCategories = categories.length > 0;
  prodCategory.disabled = !hasCategories;
  btnSaveProduct.disabled = !hasCategories;

  if (hasCategories) {
    productCategoryHint.textContent = TEXT.chooseCategory;
    productCategoryHint.style.color = 'var(--text-secondary)';
  } else {
    productCategoryHint.textContent = TEXT.addCategoryFirst;
    productCategoryHint.style.color = 'var(--text-error)';
  }
}

function syncProductEditorHeading() {
  productEditorTitle.textContent = editingProduct ? TEXT.editProductTitle : TEXT.addProductTitle;
  productEditorSubtitle.textContent = editingProduct ? TEXT.editProductSubtitle : TEXT.addProductSubtitle;
}

function syncCategoryEditorHeading() {
  categoryEditorTitle.textContent = editingCategory ? TEXT.editCategoryTitle : TEXT.addCategoryTitle;
  categoryEditorSubtitle.textContent = editingCategory ? TEXT.editCategorySubtitle : TEXT.addCategorySubtitle;
}

function getOrderStatusTone(status) {
  if (status === 'processing') {
    return 'processing';
  }

  if (status === 'completed') {
    return 'completed';
  }

  if (status === 'cancelled') {
    return 'cancelled';
  }

  return 'new';
}

function updateOrdersBadge() {
  const newOrdersCount = orders.filter((order) => order.status === 'new').length;
  btnOrdersInbox.classList.toggle('hidden', !currentSession);
  newOrdersBadge.textContent = formatCount(newOrdersCount);
  newOrdersBadge.classList.toggle('hidden', newOrdersCount === 0);
}

function renderOverviewCards() {
  const newOrdersCount = orders.filter((order) => order.status === 'new').length;
  summaryNewOrders.textContent = formatCount(newOrdersCount);
  summaryTotalOrders.textContent = formatCount(orders.length);
  summarySiteVisits.textContent = formatCount(siteStats.total_visits);
  updateOrdersBadge();
}

function openProductEditor() {
  closeCategoryEditor({ reset: false });
  syncProductEditorHeading();
  productEditorShell.classList.remove('hidden');
  productEditorShell.setAttribute('aria-hidden', 'false');
  document.body.classList.add('product-editor-open');
  productEditorSurface.scrollTop = 0;
  window.requestAnimationFrame(() => {
    prodName.focus();
  });
}

function closeProductEditor({ reset = true } = {}) {
  if (reset) {
    resetProductForm();
  }

  isProductFormDirty = false;
  productEditorShell.classList.add('hidden');
  productEditorShell.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('product-editor-open');
}

function openCategoryEditor() {
  closeProductEditor({ reset: false });
  syncCategoryEditorHeading();
  categoryEditorShell.classList.remove('hidden');
  categoryEditorShell.setAttribute('aria-hidden', 'false');
  document.body.classList.add('category-editor-open');
  categoryEditorSurface.scrollTop = 0;
  window.requestAnimationFrame(() => {
    catNameInput.focus();
  });
}

function closeCategoryEditor({ reset = true } = {}) {
  if (reset) {
    resetCategoryForm();
  }

  isCategoryFormDirty = false;
  categoryEditorShell.classList.add('hidden');
  categoryEditorShell.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('category-editor-open');
}

function populateCategories(selectedCategory = '') {
  const currentSelection = selectedCategory || prodCategory.value;
  prodCategory.innerHTML = '';

  if (!categories.length) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = TEXT.noCategoriesAvailable;
    option.selected = true;
    prodCategory.appendChild(option);
    updateProductFormState();
    return;
  }

  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.name;
    option.textContent = category.name;
    prodCategory.appendChild(option);
  });

  const categoryExists = categories.some((category) => category.name === currentSelection);
  prodCategory.value = categoryExists ? currentSelection : categories[0].name;
  updateProductFormState();
}

function renderAdminProducts() {
  if (!products.length) {
    productsTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">${TEXT.noProductsYet}</td>
      </tr>
    `;
    return;
  }

  productsTableBody.innerHTML = products.map((product) => {
    const statusLabel = product.is_available ? TEXT.available : TEXT.unavailable;
    const statusColor = product.is_available ? 'green' : 'red';
    const imageMarkup = product.image_url
      ? `<img src="${escapeHtml(product.image_url)}" width="50" height="50" style="object-fit: cover; border-radius: 8px;">`
      : '<span class="admin-image-placeholder">بدون صورة</span>';
    const availabilityLabel = product.is_available ? TEXT.disable : TEXT.activate;
    const availabilityClass = product.is_available ? 'btn-availability-on' : 'btn-availability-off';

    return `
      <tr>
        <td data-label="الصورة">
          ${imageMarkup}
        </td>
        <td data-label="الاسم">${escapeHtml(product.name)}</td>
        <td data-label="السعر">${escapeHtml(product.price)}</td>
        <td data-label="التصنيف">${escapeHtml(product.category)}</td>
        <td data-label="النقرات">${escapeHtml(Number(product.click_count) || 0)}</td>
        <td data-label="الحالة">
          <span style="color: ${statusColor}; font-weight: bold;">
            ${statusLabel}
          </span>
        </td>
        <td class="action-btns product-action-btns" data-label="إجراءات">
          ${renderTableActionButton({ action: 'toggle-product-availability', label: availabilityLabel, icon: 'check', className: availabilityClass, id: product.id })}
          ${renderTableActionButton({ action: 'edit-product', label: TEXT.edit, icon: 'edit', className: 'btn-accent', id: product.id })}
          ${renderTableActionButton({ action: 'delete-product', label: TEXT.delete, icon: 'trash', className: 'btn-danger', id: product.id })}
        </td>
      </tr>
    `;
  }).join('');
}

function renderAdminCategories() {
  if (!categories.length) {
    categoriesTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">${TEXT.noCategoriesYet}</td>
      </tr>
    `;
    return;
  }

  categoriesTableBody.innerHTML = categories.map((category) => {
    const usageCount = getCategoryUsageCount(category.name);

    return `
      <tr>
        <td style="font-size: 1.4rem;" data-label="الأيقونة">${escapeHtml(category.icon || DEFAULT_CATEGORY_ICON)}</td>
        <td data-label="التصنيف">${escapeHtml(category.name)}</td>
        <td data-label="الترتيب">${escapeHtml(Number(category.order_index) || 0)}</td>
        <td data-label="عدد المنتجات">${usageCount}</td>
        <td class="action-btns" data-label="إجراءات">
          ${renderTableActionButton({ action: 'edit-category', label: TEXT.edit, icon: 'edit', className: 'btn-accent', id: category.id })}
          ${renderTableActionButton({ action: 'delete-category', label: TEXT.delete, icon: 'trash', className: 'btn-danger', id: category.id })}
        </td>
      </tr>
    `;
  }).join('');
}

function renderAdminOrders() {
  if (!orders.length) {
    ordersTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">${TEXT.noOrdersYet}</td>
      </tr>
    `;
    return;
  }

  ordersTableBody.innerHTML = orders.map((order) => {
    const statusLabel = TEXT.orderStatusLabel(order.status);
    const statusTone = getOrderStatusTone(order.status);
    const primaryAction = order.status === 'new'
      ? { label: TEXT.process, nextStatus: 'processing', icon: 'edit', className: 'btn-accent' }
      : order.status === 'processing'
        ? { label: TEXT.complete, nextStatus: 'completed', icon: 'check', className: 'btn-availability-on' }
        : null;
    const showCancel = order.status === 'new' || order.status === 'processing';
    const phoneLink = order.customer_phone
      ? `<a href="tel:${escapeHtml(order.customer_phone)}">${escapeHtml(order.customer_phone)}</a>`
      : TEXT.none;

    return `
      <tr>
        <td data-label="المنتج">
          <strong>${escapeHtml(order.product_name)}</strong>
          <small class="form-help">${escapeHtml(order.product_category || TEXT.none)} • ${escapeHtml(order.product_price)}</small>
        </td>
        <td data-label="العميل">${escapeHtml(order.customer_name)}</td>
        <td data-label="الهاتف">${phoneLink}</td>
        <td data-label="الكمية">${escapeHtml(Number(order.quantity) || 1)}</td>
        <td data-label="الحالة">
          <span class="status-pill status-pill-${statusTone}">${statusLabel}</span>
        </td>
        <td data-label="التاريخ">${escapeHtml(formatDateTime(order.created_at))}</td>
        <td class="action-btns" data-label="إجراءات">
          ${primaryAction ? renderTableActionButton({ action: 'update-order-status', label: primaryAction.label, icon: primaryAction.icon, className: primaryAction.className, id: order.id, nextStatus: primaryAction.nextStatus }) : ''}
          ${showCancel ? renderTableActionButton({ action: 'update-order-status', label: TEXT.cancelOrder, icon: 'trash', className: 'btn-danger', id: order.id, nextStatus: 'cancelled' }) : ''}
        </td>
      </tr>
    `;
  }).join('');
}

function resetProductForm() {
  productForm.reset();
  isProductFormDirty = false;
  editingProduct = null;
  prodIdInput.value = '';
  updateFileInputName(prodImage, prodImageName);
  currentImgUrl.textContent = TEXT.none;
  btnSaveProduct.disabled = false;
  setButtonContent(btnSaveProduct, TEXT.addProduct, 'plus');
  btnCancelEdit.style.display = 'none';
  populateCategories();
  syncProductEditorHeading();
}

function resetCategoryForm() {
  categoryForm.reset();
  isCategoryFormDirty = false;
  editingCategory = null;
  catIdInput.value = '';
  catIconInput.value = '';
  catOrderInput.value = String(getNextCategoryOrder());
  btnSaveCategory.disabled = false;
  setButtonContent(btnSaveCategory, TEXT.addCategory, 'plus');
  btnCancelCategoryEdit.style.display = 'none';
  syncCategoryEditorHeading();
}

function switchTab(targetId) {
  closeProductEditor();
  closeCategoryEditor();
  tabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.target === targetId);
  });

  ['productsTab', 'categoriesTab', 'ordersTab', 'settingsTab'].forEach((tabId) => {
    document.getElementById(tabId).classList.toggle('hidden', tabId !== targetId);
  });
}

function startDashboardPolling() {
  if (dashboardRefreshTimer || !currentSession) {
    return;
  }

  dashboardRefreshTimer = window.setInterval(() => {
    loadDashboardData({ silent: true }).catch(() => {});
  }, 30000);
}

function stopDashboardPolling() {
  if (!dashboardRefreshTimer) {
    return;
  }

  window.clearInterval(dashboardRefreshTimer);
  dashboardRefreshTimer = null;
}

function showDashboard() {
  authSection.classList.add('hidden');
  dashboardSection.classList.remove('hidden');
  btnLogout.classList.remove('hidden');
  btnOrdersInbox.classList.remove('hidden');
  resetLoginProtection();
  startDashboardPolling();
}

function showLogin() {
  stopDashboardPolling();
  closeProductEditor();
  closeCategoryEditor();
  passwordInput.value = '';
  authSection.classList.remove('hidden');
  dashboardSection.classList.add('hidden');
  btnLogout.classList.add('hidden');
  btnOrdersInbox.classList.add('hidden');
  newOrdersBadge.classList.add('hidden');
  isSettingsFormDirty = false;
}

async function loadDashboardData({ silent = false } = {}) {
  try {
    const [catsRes, prodsRes, ordersRes, statsRes, settingsRes] = await Promise.all([
      fetchCategoriesFromSupabase(),
      supabase.from('products').select('*').order('id', { ascending: false }),
      fetchOrdersFromSupabase(),
      fetchSiteStatsFromSupabase(),
      fetchSiteSettingsFromSupabase(),
    ]);

    if (catsRes.error) {
      throw catsRes.error;
    }

    if (prodsRes.error) {
      throw prodsRes.error;
    }

    if (ordersRes.error) {
      throw ordersRes.error;
    }

    categories = sortCategories(catsRes.data || []);
    products = prodsRes.data || [];
    orders = ordersRes.data || [];
    siteStats = statsRes || { total_visits: 0 };
    siteSettings = settingsRes;

    if (!isProductEditorLocked()) {
      populateCategories(editingProduct?.category || '');
    }

    if (!isSettingsLocked()) {
      applySiteSettingsToForm();
    }

    renderAdminProducts();
    renderAdminCategories();
    renderAdminOrders();
    renderOverviewCards();

    if (!isProductEditorLocked() && !categories.length && editingProduct) {
      resetProductForm();
    }

    if (!isCategoryEditorLocked()) {
      if (!editingCategory) {
        resetCategoryForm();
      } else {
        const freshCategory = categories.find((category) => String(category.id) === String(editingCategory.id));
        if (!freshCategory) {
          resetCategoryForm();
        }
      }
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    if (!silent) {
      showError(TEXT.dashboardLoadError);
    }
  }
}

async function checkSession() {
  if (!hasSupabaseConfig) {
    showLogin();
    showLoginFeedback(TEXT.supabaseRequired);
    emailInput.disabled = true;
    passwordInput.disabled = true;
    setLoginButtonState({ disabled: true, label: 'ربط Supabase مطلوب', icon: 'lock' });
    return;
  }

  const storedLoginLockUntil = getStoredLoginLockUntil();
  if (storedLoginLockUntil > Date.now()) {
    showLogin();
    startLoginCooldown(storedLoginLockUntil);
    return;
  }

  const { data } = await supabase.auth.getSession();
  if (data?.session) {
    currentSession = data.session;
    showDashboard();
    await loadDashboardData();
  } else {
    showLogin();
  }
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!hasSupabaseConfig) {
    showLoginFeedback(TEXT.supabaseRequired);
    return;
  }

  const storedLoginLockUntil = getStoredLoginLockUntil();
  if (storedLoginLockUntil > Date.now()) {
    startLoginCooldown(storedLoginLockUntil);
    return;
  }

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  clearLoginFeedback();
  setLoginButtonState({ disabled: true, label: 'جارٍ التحقق...', icon: 'lock' });

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    failedLoginAttempts += 1;
    showLoginFeedback(TEXT.loginFailed);
    if (failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
      startLoginCooldown();
    } else {
      setLoginButtonState({ disabled: false, label: 'دخول', icon: 'login' });
    }
    return;
  }

  resetLoginProtection();
  currentSession = data.session;
  showDashboard();
  await loadDashboardData();
});

btnLogout.addEventListener('click', async () => {
  await supabase.auth.signOut();
  currentSession = null;
  showLogin();
});

btnOrdersInbox.addEventListener('click', () => {
  switchTab('ordersTab');
});

window.editProduct = (id) => {
  const product = products.find((item) => String(item.id) === String(id));
  if (!product) {
    return;
  }

  editingProduct = product;
  prodIdInput.value = product.id;
  prodName.value = product.name;
  prodPrice.value = product.price;
  currentImgUrl.textContent = product.image_url || TEXT.none;
  setButtonContent(btnSaveProduct, TEXT.saveChanges, 'save');
  btnCancelEdit.style.display = 'inline-flex';
  populateCategories(product.category);
  syncProductEditorHeading();
  openProductEditor();
};

window.toggleProductAvailability = async (id) => {
  const product = products.find((item) => String(item.id) === String(id));
  if (!product) {
    return;
  }

  const nextAvailability = !Boolean(product.is_available);

  try {
    const { error } = await supabase
      .from('products')
      .update({ is_available: nextAvailability })
      .eq('id', product.id);

    if (error) {
      throw error;
    }

    await loadDashboardData({ silent: true });
    showSuccess(nextAvailability ? TEXT.availabilityEnabled : TEXT.availabilityDisabled);
  } catch (error) {
    console.error('Error toggling product availability:', error);
    showError(TEXT.saveProductError);
  }
};

window.deleteProduct = async (id) => {
  const confirmed = await askConfirmation({
    title: 'حذف المنتج',
    message: TEXT.confirmDeleteProduct,
    confirmLabel: TEXT.delete,
    tone: 'danger',
  });

  if (!confirmed) {
    return;
  }

  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      throw error;
    }

    if (editingProduct && String(editingProduct.id) === String(id)) {
      resetProductForm();
      closeProductEditor({ reset: false });
    }

    await loadDashboardData({ silent: true });
    showSuccess(TEXT.productDeleted);
  } catch (error) {
    console.error('Error deleting product:', error);
    showError(TEXT.deleteProductError);
  }
};

window.editCategory = (id) => {
  const category = categories.find((item) => String(item.id) === String(id));
  if (!category) {
    return;
  }

  editingCategory = category;
  catIdInput.value = category.id;
  catNameInput.value = category.name;
  catIconInput.value = category.icon || '';
  catOrderInput.value = String(Number(category.order_index) || 0);
  setButtonContent(btnSaveCategory, TEXT.saveCategory, 'save');
  btnCancelCategoryEdit.style.display = 'inline-flex';
  syncCategoryEditorHeading();
  openCategoryEditor();
};

window.deleteCategory = async (id) => {
  const category = categories.find((item) => String(item.id) === String(id));
  if (!category) {
    return;
  }

  const usageCount = getCategoryUsageCount(category.name);
  if (usageCount > 0) {
    showWarning(TEXT.cannotDeleteCategory(category.name, usageCount));
    return;
  }

  const confirmed = await askConfirmation({
    title: 'حذف التصنيف',
    message: TEXT.confirmDeleteCategory(category.name),
    confirmLabel: TEXT.delete,
    tone: 'danger',
  });

  if (!confirmed) {
    return;
  }

  try {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      throw error;
    }

    if (editingCategory && String(editingCategory.id) === String(id)) {
      resetCategoryForm();
      closeCategoryEditor({ reset: false });
    }

    await loadDashboardData({ silent: true });
    showSuccess(TEXT.categoryDeleted);
  } catch (error) {
    console.error('Error deleting category:', error);
    showError(TEXT.deleteCategoryError);
  }
};

window.updateOrderStatus = async (id, nextStatus) => {
  const order = orders.find((item) => String(item.id) === String(id));
  if (!order) {
    return;
  }

  if (nextStatus === 'cancelled') {
    const confirmed = await askConfirmation({
      title: 'إلغاء الطلب',
      message: 'هل تريد إلغاء هذا الطلب؟',
      confirmLabel: TEXT.cancelOrder,
      tone: 'danger',
    });

    if (!confirmed) {
      return;
    }
  }

  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: nextStatus })
      .eq('id', order.id);

    if (error) {
      throw error;
    }

    await loadDashboardData({ silent: true });
    showSuccess(TEXT.orderUpdated);
  } catch (error) {
    console.error('Error updating order status:', error);
    showError(TEXT.dashboardLoadError);
  }
};

btnOpenProductEditor.addEventListener('click', () => {
  resetProductForm();
  openProductEditor();
});

btnCloseProductEditor.addEventListener('click', () => {
  closeProductEditor();
});

productEditorShell.addEventListener('click', (event) => {
  if (event.target.dataset.closeProductEditor === 'true') {
    closeProductEditor();
  }
});

btnOpenCategoryEditor.addEventListener('click', () => {
  resetCategoryForm();
  openCategoryEditor();
});

btnCloseCategoryEditor.addEventListener('click', () => {
  closeCategoryEditor();
});

categoryEditorShell.addEventListener('click', (event) => {
  if (event.target.dataset.closeCategoryEditor === 'true') {
    closeCategoryEditor();
  }
});

adminConfirmModal.addEventListener('click', (event) => {
  if (event.target.dataset.confirmClose === 'true') {
    closeConfirmModal(false);
  }
});

btnConfirmCancel.addEventListener('click', () => {
  closeConfirmModal(false);
});

btnConfirmAccept.addEventListener('click', () => {
  closeConfirmModal(true);
});

btnCancelEdit.addEventListener('click', () => {
  closeProductEditor();
});

btnCancelCategoryEdit.addEventListener('click', () => {
  closeCategoryEditor();
});

[prodName, prodPrice, prodCategory, prodImage].forEach((field) => {
  field.addEventListener('input', markProductFormDirty);
  field.addEventListener('change', markProductFormDirty);
});

[catNameInput, catIconInput, catOrderInput].forEach((field) => {
  field.addEventListener('input', markCategoryFormDirty);
  field.addEventListener('change', markCategoryFormDirty);
});

[
  heroImageUrlInput,
  heroImageFileInput,
  sitePhoneNumberInput,
  googleMapsUrlInput,
  whatsappUrlInput,
  messengerUrlInput,
  telegramUrlInput,
  facebookUrlInput,
  instagramUrlInput,
  tiktokUrlInput,
  ordersEnabledInput,
  serviceCountryInput,
  serviceRegionInput,
].forEach((field) => {
  field.addEventListener('input', markSettingsFormDirty);
  field.addEventListener('change', markSettingsFormDirty);
});

heroImageUrlInput.addEventListener('input', () => {
  if (heroImageFileInput.files.length === 0) {
    updateHeroPreview(normalizeUrl(heroImageUrlInput.value));
  }
});

heroImageFileInput.addEventListener('change', () => {
  updateFileInputName(heroImageFileInput, heroImageFileName);
  const file = heroImageFileInput.files?.[0];
  if (!file) {
    updateHeroPreview(normalizeUrl(heroImageUrlInput.value));
    return;
  }

  updateHeroPreview(URL.createObjectURL(file));
});

prodImage.addEventListener('change', () => {
  updateFileInputName(prodImage, prodImageName);
});

productForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!categories.length) {
    showWarning(TEXT.addCategoryFirst);
    return;
  }

  const isEditing = Boolean(editingProduct);
  btnSaveProduct.disabled = true;
  setButtonContent(btnSaveProduct, TEXT.loadingSave, 'save');

  try {
    const file = prodImage.files?.[0];
    let imageUrl = editingProduct?.image_url || '';

    if (file) {
      imageUrl = await uploadImageToStorage(file, 'products');
    }

    const payload = {
      name: prodName.value.trim(),
      price: Number.parseFloat(prodPrice.value),
      category: prodCategory.value,
      is_available: editingProduct?.is_available ?? true,
      image_url: imageUrl,
    };

    if (editingProduct) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id);
      if (error) {
        throw error;
      }
    } else {
      const { error } = await supabase.from('products').insert([payload]);
      if (error) {
        throw error;
      }
    }

    resetProductForm();
    closeProductEditor({ reset: false });
    await loadDashboardData({ silent: true });
    showSuccess(TEXT.productSaved);
  } catch (error) {
    console.error('Error saving product:', error);
    showError(TEXT.saveProductError);
    btnSaveProduct.disabled = false;
    setButtonContent(btnSaveProduct, isEditing ? TEXT.saveChanges : TEXT.addProduct, isEditing ? 'save' : 'plus');
  }
});

categoryForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const categoryName = catNameInput.value.trim();
  const categoryIcon = normalizeCategoryIcon(catIconInput.value);
  const orderIndex = normalizeOrderValue(catOrderInput.value);

  if (!categoryName) {
    showWarning(TEXT.categoryNameRequired);
    return;
  }

  const duplicateCategory = categories.find((category) => {
    const sameName = String(category.name).trim().toLowerCase() === categoryName.toLowerCase();
    const differentRecord = !editingCategory || String(category.id) !== String(editingCategory.id);
    return sameName && differentRecord;
  });

  if (duplicateCategory) {
    showWarning(TEXT.duplicateCategory);
    return;
  }

  const isEditing = Boolean(editingCategory);
  const oldCategoryName = editingCategory?.name || '';

  btnSaveCategory.disabled = true;
  setButtonContent(btnSaveCategory, TEXT.loadingSave, 'save');

  try {
    if (editingCategory) {
      const { error: categoryError } = await updateCategoryInSupabase(
        editingCategory.id,
        categoryName,
        orderIndex,
        categoryIcon,
      );

      if (categoryError) {
        throw categoryError;
      }

      if (oldCategoryName && oldCategoryName !== categoryName) {
        const { error: productsError } = await supabase
          .from('products')
          .update({ category: categoryName })
          .eq('category', oldCategoryName);

        if (productsError) {
          throw productsError;
        }
      }
    } else {
      const { error } = await insertCategoryIntoSupabase(categoryName, orderIndex, categoryIcon);
      if (error) {
        throw error;
      }
    }

    if (editingProduct && editingProduct.category === oldCategoryName) {
      editingProduct.category = categoryName;
    }

    resetCategoryForm();
    closeCategoryEditor({ reset: false });
    await loadDashboardData({ silent: true });
    populateCategories(editingProduct?.category || '');
    showSuccess(TEXT.categorySaved);
  } catch (error) {
    console.error('Error saving category:', error);
    showError(TEXT.saveCategoryError);
    btnSaveCategory.disabled = false;
    setButtonContent(btnSaveCategory, isEditing ? TEXT.saveCategory : TEXT.addCategory, isEditing ? 'save' : 'plus');
  }
});

settingsForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const saveButtonLabel = TEXT.saveSettings;
  btnSaveSettings.disabled = true;
  setButtonContent(btnSaveSettings, TEXT.loadingSave, 'save');

  try {
    const uploadedHeroFile = heroImageFileInput.files?.[0];
    let heroImageUrl = normalizeUrl(heroImageUrlInput.value) || siteSettings.hero_image_url || '';

    if (uploadedHeroFile) {
      heroImageUrl = await uploadImageToStorage(uploadedHeroFile, 'settings');
    }

    const nextSettings = normalizeSiteSettings({
      hero_image_url: heroImageUrl,
      phone_number: sitePhoneNumberInput.value,
      google_maps_url: googleMapsUrlInput.value,
      whatsapp_url: whatsappUrlInput.value,
      messenger_url: messengerUrlInput.value,
      telegram_url: telegramUrlInput.value,
      facebook_url: facebookUrlInput.value,
      instagram_url: instagramUrlInput.value,
      tiktok_url: tiktokUrlInput.value,
      orders_enabled: ordersEnabledInput.checked,
      service_country: serviceCountryInput.value,
      service_region: serviceRegionInput.value,
    });

    const persistedSettings = {
      id: SITE_SETTINGS_ID,
      ...nextSettings,
    };

    const { error } = await supabase
      .from('site_settings')
      .upsert([persistedSettings], { onConflict: 'id' });

    if (error) {
      if (isMissingSiteSettingsError(error)) {
        throw new Error(TEXT.saveSettingsError);
      }

      throw error;
    }

    siteSettings = persistedSettings;
    isSettingsFormDirty = false;
    applySiteSettingsToForm();
    showSuccess(TEXT.settingsSaved);
  } catch (error) {
    console.error('Error saving site settings:', error);
    showError(TEXT.saveSettingsError);
  } finally {
    btnSaveSettings.disabled = false;
    setButtonContent(btnSaveSettings, saveButtonLabel, 'save');
  }
});

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    switchTab(tab.dataset.target);
  });
});

productsTableBody.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  if (!id) {
    return;
  }

  if (action === 'toggle-product-availability') {
    window.toggleProductAvailability(id);
    return;
  }

  if (action === 'edit-product') {
    window.editProduct(id);
    return;
  }

  if (action === 'delete-product') {
    window.deleteProduct(id);
  }
});

categoriesTableBody.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  if (!id) {
    return;
  }

  if (action === 'edit-category') {
    window.editCategory(id);
    return;
  }

  if (action === 'delete-category') {
    window.deleteCategory(id);
  }
});

ordersTableBody.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) {
    return;
  }

  const { action, id, nextStatus } = button.dataset;
  if (!id) {
    return;
  }

  if (action === 'update-order-status' && nextStatus) {
    window.updateOrderStatus(id, nextStatus);
  }
});

if (hasSupabaseConfig) {
  supabase.auth.onAuthStateChange((_event, session) => {
    currentSession = session;
    if (!session) {
      showLogin();
      return;
    }

    showDashboard();
    loadDashboardData({ silent: true }).catch(() => {});
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !adminConfirmModal.classList.contains('hidden')) {
    closeConfirmModal(false);
    return;
  }

  if (event.key === 'Escape' && !productEditorShell.classList.contains('hidden')) {
    closeProductEditor();
  }

  if (event.key === 'Escape' && !categoryEditorShell.classList.contains('hidden')) {
    closeCategoryEditor();
  }
});

applyStaticButtonLabels();
resetCategoryForm();
updateProductFormState();
applySiteSettingsToForm();
switchTab('productsTab');
checkSession();
