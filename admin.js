const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// require controllers.
const controllers ={
  addOns         : require('../controllers/add-ons'),
  agency         : require('../controllers/agency-manager'),
  appearance     : require('../controllers/appearance'),
  bannerSetting  : require('../controllers/banner-settings'),
  category       : require('../controllers/category'),
  customer       : require('../controllers/customer'),
  customerQuery  : require('../controllers/customer-query'),
  dashboard      : require('../controllers/dashboard'),
  excelSheet     : require('../controllers/excelSheet'),
  footerSetting  : require('../controllers/footer-settings'),
  itemUnit       : require('../controllers/item_unit'),
  loginUser      : require('../controllers/loginUser'),
  manuFacturer   : require('../controllers/manufacturer'),
  merchantSetting: require('../controllers/merchant-settings'),
  messageSetting : require('../controllers/message-settings'),
  order          : require('../controllers/order'),
  paymentMethod  : require('../controllers/payment-method'),
  product        : require('../controllers/product'),
  profile        : require('../controllers/profile'),
  roles          : require('../controllers/roles'),
  seoSetting     : require('../controllers/seo-settings'),
  smsApi         : require('../controllers/sms-api'),
  smtpSettings   : require('../controllers/smtp-settings'),
  stock          : require('../controllers/stock'),
  subCategory    : require('../controllers/sub-category'),
  systemUpdate   : require('../controllers/system-update'),
  tax            : require('../controllers/tax'),
  user           : require('../controllers/users'),
  zipExtract     : require('../controllers/zip-extract'),
}

//multer use
var maxSize = 1*1024*1024;
var storageVal = multer.diskStorage(
  {
    destination:  function (req, file, cb) {
      console.log("file : ",file);
      console.log(req.route.path);
      if(req.route.path=='/profile-image/:id'){
        cb(null, 'assets/uploads/profileImage/');
      }else if(req.route.path=='/add-category' || req.route.path=='/update-category/:id'){
        cb(null, 'assets/uploads/category');
      }else if(req.route.path=='/save-appearance' || req.route.path=='/save-merchant-details' || req.route.path=='/save-banner'){
        cb(null, 'assets/uploads/logo+icon');
      }else if(req.route.path=='/coupon-image-save'){
        cb(null, 'assets/uploads/coupon');
      }else if(req.route.path=='/edit-variation-image'){
        cb(null, 'assets/uploads/products');
      }else{
        cb(null,'assets/uploads/');
      }
    },
    filename: function ( req, file, cb ) { 
      if(req.route.path=='/edit-variation-image'){
        cb( null,file.originalname.split('.')[0]+path.extname(file.originalname));
      }else{
        cb( null,Date.now()+path.extname(file.originalname));
      }
    }
  }
);
var upload = multer({ storage: storageVal, limits:{size : maxSize}});

router.get('/add-ons', controllers.addOns.getAddOnPage);
router.post('/add-update-addon', controllers.addOns.addUpdtAddon);
router.post('/addon-status-change', controllers.addOns.addonStatusChange);

// request in agency controller. 
router.get('/agency-manager',controllers.agency.getAgencyPage);
router.get('/search-agency-manager',controllers.agency.searchAgencyManager);
router.post('/add-agency',controllers.agency.addAgencyData);
router.post('/get-invoice-number',controllers.agency.getInvoiceNumber);
router.post('/get-price-through-invoice/:id',controllers.agency.priceThroughInvoice);
router.post('/add-pay_amount',controllers.agency.addPayAmount);
router.get('/get-view-ledger-data/:id',controllers.agency.getViewLedgerData);

// request in appearance controller.
router.get('/appearance', controllers.appearance.getAppearancePage);
router.post('/save-appearance', upload.array('image',3),controllers.appearance.saveAppearanceData);

// request in appearance controller.
router.get('/banner-settings', controllers.bannerSetting.getBannerPage);
router.post('/save-banner', upload.single('background-image'),controllers.bannerSetting.saveBannerData);

// request in category controller. 
router.get('/category', controllers.category.getCategory);
router.get('/category-search', controllers.category.searchCategory);
router.post('/add-category',upload.single('img'),controllers.category.addCategory);
router.get('/edit-category/:id',controllers.category.editCategory);
router.post('/update-category/:id',upload.single('img'),controllers.category.updateCategory);
router.post('/category-status-change',controllers.category.categoryStatusChange);

// request in customer controller.
router.get('/customer',controllers.customer.getCustomer);
router.get('/customer-search',controllers.customer.searchCustomer);

// request in customer query controller.
router.get('/customer-query', controllers.customerQuery.customerQueryPage);
router.get('/search-customer-query', controllers.customerQuery.searchCustomerQuery);
router.post('/get-customer-details/:id', controllers.customerQuery.CustomerDetail);
router.post('/send-mail-to-customer/:id', controllers.customerQuery.sendMailToCustomer);
router.post('/show-more-msg-data', controllers.customerQuery.showMoreMsgData);

// request in dashboard controller.
router.get('/dashboard', controllers.dashboard.getDashboard);
router.post('/map-chart-data', controllers.dashboard.mapChartData);

// request in excelSheet controller.
router.post('/export-to-excel-order', controllers.excelSheet.getAllOrderData);
router.post('/export-to-excel-agency', controllers.excelSheet.getAllAgencyData);
router.post('/export-to-excel-stock', controllers.excelSheet.getAllStockData);

// request in footer setting controller.
router.get('/footer-settings', controllers.footerSetting.getFooterSettingPage);
router.post('/get-state', controllers.footerSetting.getState);
router.post('/save-footer-settings', controllers.footerSetting.saveFooterSetting);

// request in item unit controller.
router.get('/unit', controllers.itemUnit.getAllUnit);
router.get('/unit-search', controllers.itemUnit.searchUnit);
router.post('/add-unit', controllers.itemUnit.addUnit);
router.get('/edit-unit', controllers.itemUnit.editUnit);
router.post('/update-unit/:id', controllers.itemUnit.updateUnit);

// request in login user controller.
router.get('/',controllers.loginUser.getLogin);
router.post('/',controllers.loginUser.postLogin);
router.get('/forgot-password',controllers.loginUser.getForgotPage);
router.post('/forgot-password',controllers.loginUser.postForgotPassword);
router.get('/logout', controllers.loginUser.logout);

// request in manuFacturer controller.
router.get('/add-products', controllers.manuFacturer.getMainPage);
router.get('/search-product-manufacturter', controllers.manuFacturer.searchProductManuf);
router.post('/save-manufacturer', controllers.manuFacturer.saveManufacturer);
router.get('/get-edit-manufacturer/:id', controllers.manuFacturer.getManuf);
router.post('/update-manufacturer', controllers.manuFacturer.updateManuf);
router.post('/delete-manuf-product/:id', controllers.manuFacturer.deleteManufProduct);

// request in merchant-setting controller.
router.get('/merchant-settings', controllers.merchantSetting.getMerchantSettingPage);
router.post('/save-merchant-details', upload.single('image'),controllers.merchantSetting.saveMerchantDetails);

// request in message-setting controller.
router.get('/message-settings', controllers.messageSetting.getMessageSettingPage);
router.post('/get-message', controllers.messageSetting.getMessage);
router.post('/save-sms-settings', controllers.messageSetting.saveSmsSettings);

// request in order controller.
router.get('/orders', controllers.order.getOrder);
router.get('/order-search', controllers.order.searchOrder);
router.post('/customer-invoice', controllers.order.customerInvoice);
router.post('/order-status-update', controllers.order.orderStatusUpdate);
router.post('/get-order-product/:id', controllers.order.getOrderProduct);

// request in payment method controller.
router.get('/payment-method', controllers.paymentMethod.getPaymentMethodPage);
router.post('/paypal-credential-save', controllers.paymentMethod.savePaypalCredentials);
router.post('/stripe-credential-save', controllers.paymentMethod.saveStripeCredentials);

// request in product controller.
router.get('/products', controllers.product.getProductPage);
router.get('/add-product', controllers.product.getAddProduct);
router.post('/add-product', controllers.product.addProduct);
router.get('/edit-product/:id', controllers.product.editProduct);
router.post('/edit-variation-image',upload.array('image',50), controllers.product.editVariationImage);
router.post('/update-product/:id', controllers.product.updateProduct);
router.post('/get-subcategory',controllers.product.getSubCategory);
router.get('/get-unit', controllers.product.getUnitData);
router.post('/get-variation/:id', controllers.product.getVariation);
router.post('/update-variation', controllers.product.updateVariation);
router.get('/products-search', controllers.product.searchProduct);
router.post('/product-status-change', controllers.product.productStatusChange);
router.post('/show-more-data', controllers.product.showMoreData);

// request in profile controller.
router.get('/profile', controllers.profile.getProfile);
router.post('/profile-image/:id', upload.single('image'), controllers.profile.profileImage);
router.post('/update-profile/:id', controllers.profile.updateProfile);

// request in roles controller.
router.get('/roles/:id', controllers.roles.getRoles);

// request in seo-setting controller.
router.get('/seo-settings', controllers.seoSetting.getSeoSettingPage);
router.post('/save-seo-settings', controllers.seoSetting.saveSeoSettings);

// request in SMS Api controller.
router.get('/sms-api', controllers.smsApi.getSmsApiPage);
router.post('/msg-api-data', controllers.smsApi.msgApiData);

// request in smtp controller.
router.get('/smtp-settings', controllers.smtpSettings.getSmtpSettingPage);
router.post('/save-mail-settings', controllers.smtpSettings.saveMailSettings);

// request in stock controller.
router.get('/stock-management', controllers.stock.getStock);
router.get('/search-stock-management', controllers.stock.searchStockData);

// request in sub-category controller.
router.get('/sub-category', controllers.subCategory.getSubCategory);
router.get('/sub-category-search', controllers.subCategory.searchSubCategory);
router.post('/add-subcategory', controllers.subCategory.addSubCategory);
router.get('/edit-sub-category/:id',controllers.subCategory.editSubCategory);
router.post('/update-sub-category/:id',controllers.subCategory.updateSubCategory);
router.post('/subcategory-status-change',controllers.subCategory.subCategoryStatusChange);

// request in system update controller.
router.get('/system-update', controllers.systemUpdate.getSystemUpdatePage);
router.post('/upload-zip', upload.single('update-zip'), controllers.systemUpdate.uploadZip);
router.post('/update-new-version', controllers.systemUpdate.updateNewVersion);

// request in tax controller.
router.get('/tax-master', controllers.tax.getTaxPage);
router.get('/tax-search', controllers.tax.taxSearch);
router.post('/tax-data-save', controllers.tax.addTaxData);
router.post('/get-tax-by-id', controllers.tax.getTaxById);
router.post('/update-tax', controllers.tax.updateTax);
router.post('/status-change', controllers.tax.statusChange);

// request in user controller.
router.get('/users', controllers.user.getUsers);
router.get('/user-search', controllers.user.searchUser);
router.post('/add-user', controllers.user.addUsers);
router.get('/edit-user/:id', controllers.user.editUser);
router.post('/update-user/:id', controllers.user.updateUser);
router.post('/user-status-change', controllers.user.userStatusChange);

// request in zip-extract controller.
router.get('/addon-zip-upload', controllers.zipExtract.zipUploadTesting);
router.post('/zip-extract-here', upload.single('zip'),controllers.zipExtract.zipExtractHere);
router.post('/add-additional-data', controllers.zipExtract.addAdditionalData);

module.exports = router;
