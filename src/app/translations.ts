export interface TranslationCatalog {
  common: {
    appName: string;
    appSub: string;
    back: string;
    save: string;
    edit: string;
    delete: string;
    cancel: string;
    confirm: string;
    confirmTitle: string;
    actions: string;
    loading: string;
    noData: string;
    searchPlaceholder: string;
    ctrlK: string;
    newPrompt: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    updateAvailable: string;
    updateMessage: string;
    relaunch: string;
    later: string;
    deleteConfirmTitle: string;
    deleteConfirmMessage: string;
    all: string;
  };
  sidebar: {
    dashboard: string;
    prompts: string;
    favorites: string;
    categories: string;
    tags: string;
    search: string;
    importExport: string;
    backups: string;
    settings: string;
    dbStatus: string;
    status: string;
    connected: string;
    promptsCount: string;
    storage: string;
    storageLocal: string;
    manageBackups: string;
  };
  header: {
    proMode: string;
    notepadMode: string;
  };
  statusBar: {
    allSystemsGo: string;
    syncLabel: string;
    spaceUsed: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    totalPrompts: string;
    promptsSaved: string;
    favorites: string;
    promptsFavorited: string;
    categories: string;
    categoriesActive: string;
    tags: string;
    tagsUsed: string;
    mostUsed: string;
    mostUsedSub: string;
    recentPrompts: string;
    recentPromptsSub: string;
    recentEdits: string;
    recentEditsSub: string;
    recentActivity: string;
    recentActivitySub: string;
    viewAllMostUsed: string;
    viewAllPrompts: string;
    viewAllActivity: string;
    noActivity: string;
    times: {
      todayAgo: string;
      todayAt: string;
      yesterdayAt: string;
    };
    timesCount: string;
  };
  prompts: {
    title: string;
    subtitle: string;
    filterCategory: string;
    filterTag: string;
    sortBy: string;
    searchLabel: string;
    searchPlaceholder: string;
    allCategories: string;
    allTags: string;
    sortLastUpdated: string;
    sortMostUsed: string;
    sortTitle: string;
    previewTitle: string;
    unclassified: string;
    lastUpdated: string;
    dateCreated: string;
    usages: string;
    statusLabel: string;
    statusActive: string;
    ownerLabel: string;
    ownerMe: string;
    actionEdit: string;
    actionCopy: string;
    actionDuplicate: string;
    actionFullVersion: string;
    promptsCount: string;
    noResults: string;
    showing: string;
    copiedToast: string;
    duplicateToast: string;
  };
  favorites: {
    title: string;
    subtitle: string;
    noFavorites: string;
  };
  categories: {
    title: string;
    subtitle: string;
    newCategory: string;
    categoryNamePlaceholder: string;
    categoryDescPlaceholder: string;
    editCategory: string;
    addBtn: string;
    saveBtn: string;
    cancelBtn: string;
    nameLabel: string;
    descLabel: string;
    promptCount: string;
    createdDate: string;
    actions: string;
    successAdd: string;
    successUpdate: string;
    successDelete: string;
  };
  tags: {
    title: string;
    subtitle: string;
    newTag: string;
    tagNamePlaceholder: string;
    editTag: string;
    addBtn: string;
    saveBtn: string;
    cancelBtn: string;
    nameLabel: string;
    usageCount: string;
    actions: string;
    successAdd: string;
    successUpdate: string;
    successDelete: string;
  };
  search: {
    title: string;
    subtitle: string;
    keywordLabel: string;
    keywordPlaceholder: string;
    categoryLabel: string;
    tagLabel: string;
    dateRangeLabel: string;
    allDates: string;
    pastWeek: string;
    pastMonth: string;
    pastYear: string;
    searchBtn: string;
    resetBtn: string;
    resultsTitle: string;
    noResults: string;
    onlyFavorites: string;
    statusLabel: string;
    statusActive: string;
    statusArchived: string;
    promptCol: string;
    categoryCol: string;
    actionsCol: string;
    openDetails: string;
  };
  importExport: {
    title: string;
    subtitle: string;
    exportCardTitle: string;
    exportCardDesc: string;
    exportBtn: string;
    importCardTitle: string;
    importCardDesc: string;
    importDragText: string;
    importOrText: string;
    importBtn: string;
    importSuccessToast: string;
    importFailToast: string;
    exportSuccessToast: string;
    selectFile: string;
    changeFile: string;
    chooseFile: string;
    supportedFormat: string;
    importOptions: string;
    skipDuplicates: string;
    startImport: string;
    exportScope: string;
    allData: string;
    onlyFavorites: string;
    fileFormat: string;
    jsonFormatDesc: string;
    exportWarning: string;
    exportSelectedBtn: string;
    selectFileFirst: string;
    invalidStructure: string;
    importSuccessCount: string;
    importFail: string;
    exportSuccess: string;
  };
  backups: {
    title: string;
    subtitle: string;
    autoBackups: string;
    manualBackups: string;
    restoreBtn: string;
    deleteBtn: string;
    sizeLabel: string;
    dateLabel: string;
    typeLabel: string;
    statusLabel: string;
    successStatus: string;
    restoreConfirmTitle: string;
    restoreConfirmMessage: string;
    restoreSuccessToast: string;
    deleteSuccessToast: string;
    createSuccessToast: string;
    historyTitle: string;
    historySub: string;
    failStatus: string;
    noBackups: string;
    deleteConfirmTitle: string;
    deleteConfirmMessage: string;
    createNowTitle: string;
    createNowDesc: string;
    runManualBackup: string;
    settingsTitle: string;
    settingsAuto: string;
    settingsFrequency: string;
    settingsRetention: string;
    settingsRetentionVal: string;
    settingsFrequencyVal: string;
  };
  settings: {
    title: string;
    subtitle: string;
    tabGeneral: string;
    tabAI: string;
    tabCloud: string;
    tabBackup: string;
    tabShortcuts: string;
    tabAbout: string;
    generalSettings: string;
    visualTheme: string;
    themeDesc: string;
    themeLight: string;
    themeDark: string;
    themeSystem: string;
    appLanguage: string;
    languageDesc: string;
    autosaveLabel: string;
    autosaveDesc: string;
    autosaveIntervalLabel: string;
    autosaveIntervalDesc: string;
    autosaveIntervalValue: string;
    promptPreviewLabel: string;
    promptPreviewDesc: string;
    tooltipsLabel: string;
    tooltipsDesc: string;
    dbLocationLabel: string;
    dbLocationDesc: string;
    changePathBtn: string;
    pathChangeSuccess: string;
    pathChangeFail: string;
    desktopOnlyWarning: string;
    aiTitle: string;
    aiDesc: string;
    apiKeyActive: string;
    geminiPlaceholder: string;
    openaiPlaceholder: string;
    claudePlaceholder: string;
    testBtn: string;
    keyStoredNote: string;
    testSuccessToast: string;
    testInputWarning: string;
    cloudTitle: string;
    googleDriveDesc: string;
    googleDriveTokenPlaceholder: string;
    testCloudBtn: string;
    cloudLinkBtn: string;
    cloudUnlinkBtn: string;
    dropboxDesc: string;
    dropboxTokenPlaceholder: string;
    backupTitle: string;
    backupEnableLabel: string;
    backupEnableDesc: string;
    backupFreqLabel: string;
    backupFreqDesc: string;
    backupFreqDaily: string;
    backupFreqWeekly: string;
    backupFreqMonthly: string;
    backupRetentionLabel: string;
    backupRetentionDesc: string;
    localFirstNote: string;
    backupNowBtn: string;
    manageBackupsBtn: string;
    backupSuccessToast: string;
    shortcutsTitle: string;
    shortcutsDesc: string;
    shortcutSearch: string;
    shortcutNewPrompt: string;
    shortcutSave: string;
    shortcutToggleSidebar: string;
    aboutTitle: string;
    aboutDesc: string;
    aboutVersion: string;
    aboutAuthor: string;
  };
  notepad: {
    searchPlaceholder: string;
    allPrompts: string;
    noPrompts: string;
    noCategoryPrompts: string;
    newPromptBtn: string;
    editMode: string;
    previewMode: string;
    titlePlaceholder: string;
    contentPlaceholder: string;
    promptSaved: string;
    promptAutoSaved: string;
    variablesLabel: string;
    noVariables: string;
    clickToInsert: string;
    tagsLabel: string;
    categoryLabel: string;
    usageCountLabel: string;
    createdLabel: string;
    updatedLabel: string;
    favoriteTooltip: string;
    copyTooltip: string;
    deleteTooltip: string;
    notepadTitle: string;
    notepadSub: string;
    wordCount: string;
    charCount: string;
    variablesDetected: string;
  };
  editor: {
    editPrompt: string;
    newPrompt: string;
    subtitle: string;
    cancel: string;
    savePrompt: string;
    promptContent: string;
    enterDetails: string;
    autosaved: string;
    titleLabel: string;
    titlePlaceholder: string;
    category: string;
    tagsLabel: string;
    tagsPlaceholder: string;
    authorLabel: string;
    sourceLabel: string;
    contentLabel: string;
    contentSubtitle: string;
    modeEditor: string;
    modePreview: string;
    enhanceGemini: string;
    geminiReady: string;
    enhanceOpenAI: string;
    openaiReady: string;
    enhanceClaude: string;
    claudeReady: string;
    tooltipUploadImage: string;
    tooltipUndo: string;
    tooltipRedo: string;
    fontSans: string;
    fontMono: string;
    fontSerif: string;
    tooltipColor: string;
    tooltipHighlight: string;
    clearFormat: string;
    clearHighlight: string;
    headings: string;
    heading: string;
    tooltipAlignRight: string;
    tooltipAlignCenter: string;
    tooltipAlignLeft: string;
    tooltipAlignJustify: string;
    promptInsertLink: string;
    editorPlaceholder: string;
    charCountText: string;
    aiEnhancing: string;
    noContentPreview: string;
    notes: string;
    notesSubtitle: string;
    notesPlaceholder: string;
    variables: string;
    variablesSubtitle: string;
    badgeText: string;
    noVariables: string;
    promptInfo: string;
    createdAt: string;
    lastModified: string;
    creator: string;
    status: string;
    usageEstimate: string;
    tokens: string;
    approximate: string;
    charCountTitle: string;
    includingSpaces: string;
    untitled: string;
    successEnhance: string;
    writePromptFirst: string;
    enhanceFailed: string;
    secondsAgo: string;
  };
  details: {
    promptNotFound: string;
    backToPrompts: string;
    duplicateSuccess: string;
    title: string;
    subtitle: string;
    favorite: string;
    addToFavorites: string;
    duplicate: string;
    edit: string;
    copyPrompt: string;
    promptText: string;
    previewTextSubtitle: string;
    aiAssistantTitle: string;
    aiAssistantSubtitle: string;
    improvePrompt: string;
    askAiPlaceholder: string;
    assistantResponse: string;
    clear: string;
    copy: string;
    versionsTitle: string;
    creatorCol: string;
    releaseDateCol: string;
    releaseEditCol: string;
    noVersions: string;
    relatedPrompts: string;
    noRelated: string;
    category: string;
    tags: string;
    version: string;
    usages: string;
    source: string;
    dates: string;
    createdAt: string;
    lastUpdatedAt: string;
    error: string;
  };
}

export const translations: Record<'ar' | 'en', TranslationCatalog> = {
  ar: {
    common: {
      appName: "PromptVault",
      appSub: "منصة إدارة البرومبتات",
      back: "عودة",
      save: "حفظ",
      edit: "تعديل",
      delete: "حذف",
      cancel: "إلغاء",
      confirm: "موافق",
      confirmTitle: "تأكيد الإجراء",
      actions: "الإجراءات",
      loading: "جاري التحميل...",
      noData: "لا توجد بيانات متاحة",
      searchPlaceholder: "البحث في العنوان، النص، الوسوم، التصنيف، والملاحظات...",
      ctrlK: "Ctrl+K",
      newPrompt: "برومبت جديد",
      success: "نجاح",
      warning: "تحذير",
      danger: "خطأ",
      info: "معلومات",
      updateAvailable: "تحديث متوفر",
      updateMessage: "تحديث جديد جاهز للتثبيت. هل تريد إعادة تشغيل التطبيق وتثبيت التحديث الآن؟",
      relaunch: "إعادة التشغيل",
      later: "لاحقاً",
      deleteConfirmTitle: "هل أنت متأكد؟",
      deleteConfirmMessage: "لا يمكن التراجع عن هذا الإجراء بمجرد إتمامه.",
      all: "الكل",
    },
    sidebar: {
      dashboard: "الرئيسية",
      prompts: "البرومبتات",
      favorites: "المفضلة",
      categories: "التصنيفات",
      tags: "الوسوم",
      search: "البحث المتقدم",
      importExport: "استيراد / تصدير",
      backups: "النسخ الاحتياطي",
      settings: "الإعدادات",
      dbStatus: "حالة قاعدة البيانات",
      status: "الحالة:",
      connected: "متصل",
      promptsCount: "البرومبتات:",
      storage: "تخزين:",
      storageLocal: "محلي (Local)",
      manageBackups: "إدارة النسخ الاحتياطي",
    },
    header: {
      proMode: "الوضع الاحترافي",
      notepadMode: "وضع المفكرة",
    },
    statusBar: {
      allSystemsGo: "جميع الأنظمة تعمل بشكل طبيعي",
      syncLabel: "المزامنة: اليوم، 02:30 م",
      spaceUsed: "المساحة المستخدمة: 256.8 MB من 5 GB (5%)",
    },
    dashboard: {
      title: "لوحة التحكم",
      subtitle: "نظرة تشغيلية سريعة على حالة مكتبة البرومبتات المحلية.",
      totalPrompts: "إجمالي البرومبتات",
      promptsSaved: "برومبت محفوظ",
      favorites: "المفضلة",
      promptsFavorited: "برومبت مفضل",
      categories: "التصنيفات",
      categoriesActive: "تصنيف نشط",
      tags: "الوسوم",
      tagsUsed: "وسم مستخدم",
      mostUsed: "الأكثر استخداماً",
      mostUsedSub: "البرومبتات الأكثر طلباً واستدعاءً في عملياتك.",
      recentPrompts: "آخر البرومبتات",
      recentPromptsSub: "آخر الإضافات التي تمت إلى مكتبتك المحلية.",
      recentEdits: "آخر تعديل",
      recentEditsSub: "آخر البرومبتات التي تم تحديثها مؤخراً.",
      recentActivity: "النشاط الأخير",
      recentActivitySub: "سجل العمليات والنشاطات الأخيرة على النظام.",
      viewAllMostUsed: "عرض جميع البرومبتات الأكثر استخداماً",
      viewAllPrompts: "عرض جميع البرومبتات",
      viewAllActivity: "عرض كل النشاطات",
      noActivity: "لا توجد نشاطات مسجلة حالياً.",
      times: {
        todayAgo: "اليوم، منذ {min} د",
        todayAt: "اليوم، {time}",
        yesterdayAt: "أمس، {time}",
      },
      timesCount: "{count} مرة",
    },
    prompts: {
      title: "البرومبتات",
      subtitle: "إدارة واستعراض جميع البرومبتات المحفوظة في مكتبتك.",
      filterCategory: "التصنيف",
      filterTag: "الوسوم",
      sortBy: "ترتيب حسب",
      searchLabel: "ابحث",
      searchPlaceholder: "ابحث...",
      allCategories: "كل التصنيفات",
      allTags: "كل الوسوم",
      sortLastUpdated: "آخر تعديل",
      sortMostUsed: "الأكثر استخداماً",
      sortTitle: "العنوان",
      previewTitle: "معاينة البرومبت",
      unclassified: "غير مصنف",
      lastUpdated: "آخر تعديل:",
      dateCreated: "تاريخ الإنشاء:",
      usages: "الاستخدامات:",
      statusLabel: "الحالة:",
      statusActive: "نشط",
      ownerLabel: "المالك:",
      ownerMe: "أنت",
      actionEdit: "تحرير",
      actionCopy: "نسخ",
      actionDuplicate: "تكرار",
      actionFullVersion: "عرض النسخة الكاملة",
      promptsCount: "{count} برومبت",
      noResults: "لا توجد نتائج مطابقة لبحثك...",
      showing: "عرض 1 - {count} من {total} برومبت",
      copiedToast: "تم نسخ البرومبت بنجاح!",
      duplicateToast: "تم تكرار البرومبت بنجاح!",
    },
    favorites: {
      title: "البرومبتات المفضلة",
      subtitle: "الوصول السريع إلى البرومبتات المميزة بنجمة.",
      noFavorites: "لا توجد برومبتات مفضلة مضافة حالياً.",
    },
    categories: {
      title: "التصنيفات",
      subtitle: "تنظيم البرومبتات في مجالات وفئات مخصصة.",
      newCategory: "تصنيف جديد",
      categoryNamePlaceholder: "اسم التصنيف (مثال: البرمجة، الكتابة الإبداعية)",
      categoryDescPlaceholder: "وصف موجز للتصنيف والغرض منه...",
      editCategory: "تعديل التصنيف",
      addBtn: "إضافة تصنيف جديد",
      saveBtn: "حفظ التغييرات",
      cancelBtn: "إلغاء الإجراء",
      nameLabel: "اسم التصنيف",
      descLabel: "الوصف",
      promptCount: "عدد البرومبتات",
      createdDate: "تاريخ الإنشاء",
      actions: "الإجراءات",
      successAdd: "تم إضافة التصنيف بنجاح!",
      successUpdate: "تم تحديث التصنيف بنجاح!",
      successDelete: "تم حذف التصنيف بنجاح!",
    },
    tags: {
      title: "الوسوم",
      subtitle: "إضافة وسوم نصية لتصنيف البرومبتات وتسهيل البحث السريع.",
      newTag: "وسم جديد",
      tagNamePlaceholder: "اسم الوسم (مثال: python، copy_writing)",
      editTag: "تعديل الوسم",
      addBtn: "إضافة الوسم",
      saveBtn: "حفظ الوسم",
      cancelBtn: "إلغاء",
      nameLabel: "اسم الوسم",
      usageCount: "مرات الاستخدام",
      actions: "الإجراءات",
      successAdd: "تم إضافة الوسم بنجاح!",
      successUpdate: "تم تحديث الوسم بنجاح!",
      successDelete: "تم حذف الوسم بنجاح!",
    },
    search: {
      title: "البحث المتقدم",
      subtitle: "ابحث في مكتبة البرومبتات بدقة وفعالية باستخدام الفلاتر المتقدمة.",
      keywordLabel: "الكلمات المفتاحية",
      keywordPlaceholder: "ابحث في العنوان، المحتوى، أو الملاحظات...",
      categoryLabel: "التصنيف المستهدف",
      tagLabel: "الوسم",
      dateRangeLabel: "النطاق الزمني",
      allDates: "جميع الأوقات",
      pastWeek: "الأسبوع الماضي",
      pastMonth: "الشهر الماضي",
      pastYear: "العام الماضي",
      searchBtn: "تنفيذ البحث المتقدم",
      resetBtn: "إعادة تعيين الفلاتر",
      resultsTitle: "نتائج البحث المتقدم",
      noResults: "لا توجد نتائج مطابقة لشروط البحث...",
      onlyFavorites: "المفضلة فقط",
      statusLabel: "الحالة",
      statusActive: "نشط",
      statusArchived: "مؤرشف",
      promptCol: "البرومبت",
      categoryCol: "التصنيف",
      actionsCol: "الإجراءات",
      openDetails: "فتح التفاصيل",
    },
    importExport: {
      title: "استيراد / تصدير البيانات",
      subtitle: "احصل على نسخة احتياطية أو انقل بياناتك إلى جهاز آخر بسهولة.",
      exportCardTitle: "تصدير قاعدة البيانات",
      exportCardDesc: "تصدير جميع البرومبتات، التصنيفات، والوسوم في ملف JSON واحد.",
      exportBtn: "تصدير البيانات الآن",
      importCardTitle: "استيراد قاعدة البيانات",
      importCardDesc: "دمج أو استبدال قاعدة البيانات الحالية بملف JSON خارجي.",
      importDragText: "اسحب ملف JSON هنا أو",
      importOrText: "أو",
      importBtn: "اختر الملف من جهازك",
      importSuccessToast: "تم استيراد البيانات وتحديثها بنجاح!",
      importFailToast: "الملف المختار غير صالح أو تالف.",
      exportSuccessToast: "تم تصدير ملف البيانات بنجاح!",
      selectFile: "اضغط لاختيار ملف البيانات",
      changeFile: "تغيير الملف",
      chooseFile: "اختيار ملف",
      supportedFormat: "يدعم فقط ملفات JSON المصدرة",
      importOptions: "خيارات الاستيراد",
      skipDuplicates: "تخطي البرومبتات المكررة (عبر العنوان)",
      startImport: "بدء عملية الاستيراد",
      exportScope: "نطاق التصدير",
      allData: "جميع البيانات",
      onlyFavorites: "المفضلة فقط",
      fileFormat: "صيغة الملف",
      jsonFormatDesc: "تصدير كامل البيانات مدمجة للاستعادة لاحقاً",
      exportWarning: "سيتم تصدير {count} برومبت مع كامل التصنيفات والوسوم الخاصة بها.",
      exportSelectedBtn: "تصدير الملف المختار",
      selectFileFirst: "يرجى اختيار ملف أولاً.",
      invalidStructure: "بنية الملف غير صالحة. يجب أن يحتوي الملف على قائمة البرومبتات.",
      importSuccessCount: "تم استيراد البيانات بنجاح! تم إضافة {count} برومبت جديد.",
      importFail: "فشل في قراءة الملف أو تحليله كملف JSON صالح.",
      exportSuccess: "تم تصدير الملف بنجاح!",
    },
    backups: {
      title: "النسخ الاحتياطي",
      subtitle: "إدارة النسخ الاحتياطية واستعادة قاعدة البيانات عند الحاجة.",
      autoBackups: "نسخ احتياطي تلقائي",
      manualBackups: "نسخ احتياطي يدوي",
      restoreBtn: "استعادة",
      deleteBtn: "حذف",
      sizeLabel: "الحجم",
      dateLabel: "التاريخ والوقت",
      typeLabel: "نوع النسخة",
      statusLabel: "الحالة",
      successStatus: "ناجحة",
      restoreConfirmTitle: "استعادة النسخة الاحتياطية",
      restoreConfirmMessage: "هل أنت متأكد من استعادة هذه النسخة؟ سيتم استبدال البيانات الحالية بالكامل بالبيانات المستعادة.",
      restoreSuccessToast: "تم استعادة النسخة الاحتياطية بنجاح!",
      deleteSuccessToast: "تم حذف ملف النسخة الاحتياطية بنجاح!",
      createSuccessToast: "تم إنشاء نسخة احتياطية جديدة بنجاح!",
      historyTitle: "سجل النسخ الاحتياطية",
      historySub: "جميع النسخ الاحتياطية التي تم إنشاؤها",
      failStatus: "فاشلة",
      noBackups: "لا توجد نسخ احتياطية متوفرة حالياً.",
      deleteConfirmTitle: "حذف النسخة الاحتياطية",
      deleteConfirmMessage: "هل أنت متأكد من رغبتك في حذف هذه النسخة الاحتياطية؟",
      createNowTitle: "إنشاء نسخة الآن",
      createNowDesc: "قم بإنشاء نسخة احتياطية فورية وحفظها في قاعدة البيانات المحلية لاستعادتها وقت الحاجة.",
      runManualBackup: "تنفيذ النسخ اليدوي",
      settingsTitle: "إعدادات النسخ",
      settingsAuto: "النسخ التلقائي",
      settingsFrequency: "التكرار",
      settingsRetention: "الاحتفاظ بآخر",
      settingsRetentionVal: "{count} نسخ",
      settingsFrequencyVal: "يومي",
    },
    settings: {
      title: "الإعدادات",
      subtitle: "خصص تجربة استخدام PromptVault بما يناسب احتياجاتك وتفضيلاتك.",
      tabGeneral: "عام",
      tabAI: "الذكاء الاصطناعي",
      tabCloud: "المزامنة السحابية",
      tabBackup: "النسخ الاحتياطي",
      tabShortcuts: "الاختصارات",
      tabAbout: "حول",
      generalSettings: "الإعدادات العامة",
      visualTheme: "المظهر المرئي",
      themeDesc: "اختر بين الوضع الفاتح، الداكن، أو التلقائي.",
      themeLight: "فاتح",
      themeDark: "داكن",
      themeSystem: "تلقائي",
      appLanguage: "لغة التطبيق الافتراضية",
      languageDesc: "حدد اللغة المفضلة للواجهة البرمجية.",
      autosaveLabel: "الحفظ التلقائي",
      autosaveDesc: "حفظ التغييرات تلقائياً عند التحرير في المحرر.",
      autosaveIntervalLabel: "فترة الحفظ التلقائي",
      autosaveIntervalDesc: "الفترة الزمنية بين عمليات الحفظ التلقائي (بالدقائق).",
      autosaveIntervalValue: "{val} دقيقة",
      promptPreviewLabel: "عرض معاينة البرومبت",
      promptPreviewDesc: "إظهار بطاقات معاينة سريعة للبرومبت عند التصفح.",
      tooltipsLabel: "عرض تلميحات المساعدة (Tooltips)",
      tooltipsDesc: "عرض إرشادات نصية صغيرة عند الحوم فوق عناصر واجهة المستخدم.",
      dbLocationLabel: "موقع قاعدة البيانات",
      dbLocationDesc: "المجلد المحلي الذي تُخزن فيه بيانات البرومبتات. سيتم ترحيل البيانات تلقائياً للموقع المختار.",
      changePathBtn: "تغيير المسار",
      pathChangeSuccess: "تمت إعادة تعيين مجلد قاعدة البيانات بنجاح",
      pathChangeFail: "فشل في تعيين مسار قاعدة البيانات",
      desktopOnlyWarning: "تغيير مسار قاعدة البيانات متاح فقط في نسخة سطح المكتب",
      aiTitle: "ذكاء اصطناعي مدمج",
      aiDesc: "تكامل API يسمح لك بتحسين البرومبتات، اختبارها، وتوليد اقتراحات ذكية مباشرة داخل التطبيق.",
      apiKeyActive: "مفعّل ونشط",
      geminiPlaceholder: "أدخل مفتاح Gemini API هنا...",
      openaiPlaceholder: "أدخل مفتاح OpenAI API هنا...",
      claudePlaceholder: "أدخل مفتاح Anthropic API هنا...",
      testBtn: "اختبار اتصال {provider}",
      keyStoredNote: "يتم تخزين المفاتيح محلياً على جهازك فقط ولا يتم مشاركتها مع أي طرف ثالث.",
      testSuccessToast: "تم التحقق من مفتاح {provider} بنجاح والاتصال بالخادم سليم!",
      testInputWarning: "يرجى إدخال مفتاح الاتصال أولاً قبل الاختبار",
      cloudTitle: "المزامنة السحابية",
      googleDriveDesc: "مزامنة البيانات عبر جوجل درايف",
      googleDriveTokenPlaceholder: "أدخل رمز Google Access Token...",
      testCloudBtn: "اختبار الاتصال بالسحابة",
      cloudLinkBtn: "ربط الحساب الآن",
      cloudUnlinkBtn: "إلغاء الربط",
      dropboxDesc: "مزامنة البيانات عبر دروب بوكس",
      dropboxTokenPlaceholder: "أدخل Dropbox Access Token...",
      backupTitle: "الأمان والنسخ الاحتياطي",
      backupEnableLabel: "تمكين النسخ الاحتياطي التلقائي",
      backupEnableDesc: "إنشاء نسخ احتياطية للبيانات بشكل دوري وتلقائي.",
      backupFreqLabel: "تكرار النسخ الاحتياطي",
      backupFreqDesc: "معدل تكرار النسخ الاحتياطي المفضل.",
      backupFreqDaily: "يومي (Daily)",
      backupFreqWeekly: "أسبوعي (Weekly)",
      backupFreqMonthly: "شهري (Monthly)",
      backupRetentionLabel: "الحد الأقصى للنسخ المحفوظة",
      backupRetentionDesc: "عدد ملفات النسخ الاحتياطي التي يتم الاحتفاظ بها قبل حذف الأقدم.",
      localFirstNote: "تُخزن جميع بياناتك، برومبتاتك، وإعداداتك محلياً كلياً (Local-first). يمكنك في أي وقت بدء عملية نسخ احتياطي فوري لتصدير قاعدة البيانات كاملة.",
      backupNowBtn: "تنفيذ نسخ احتياطي فوري",
      manageBackupsBtn: "إدارة النسخ الاحتياطية السابقة",
      backupSuccessToast: "تم إنشاء نسخة احتياطية جديدة للبيانات محلياً بنجاح",
      shortcutsTitle: "اختصارات لوحة المفاتيح",
      shortcutsDesc: "استخدم الاختصارات التالية لتسريع مهامك اليومية.",
      shortcutSearch: "فتح نافذة البحث السريع",
      shortcutNewPrompt: "إنشاء برومبت جديد",
      shortcutSave: "حفظ البرومبت الحالي في المحرر",
      shortcutToggleSidebar: "إظهار / إخفاء القائمة الجانبية",
      aboutTitle: "حول البرنامج",
      aboutDesc: "مدير البرومبتات الذكي والمحلي لحفظ وإدارة وتطوير البرومبتات الخاصة بالذكاء الاصطناعي.",
      aboutVersion: "الإصدار: v1.2.1",
      aboutAuthor: "المطور: سفيان ناصر",
    },
    notepad: {
      searchPlaceholder: "البحث عن برومبت...",
      allPrompts: "جميع البرومبتات",
      noPrompts: "لا توجد برومبتات متوفرة...",
      noCategoryPrompts: "لا توجد برومبتات في هذا التصنيف...",
      newPromptBtn: "إنشاء برومبت جديد",
      editMode: "تحرير",
      previewMode: "معاينة",
      titlePlaceholder: "عنوان البرومبت الجديد...",
      contentPlaceholder: "اكتب البرومبت هنا... استخدم {المتغيرات} إذا كنت بحاجة إلى حقول ديناميكية.",
      promptSaved: "تم حفظ البرومبت بنجاح!",
      promptAutoSaved: "تم الحفظ تلقائياً",
      variablesLabel: "المتغيرات المكتشفة",
      noVariables: "لا توجد متغيرات مكتشفة في النص الحالي.",
      clickToInsert: "اضغط على المتغير لتعبئته",
      tagsLabel: "الوسوم",
      categoryLabel: "التصنيف",
      usageCountLabel: "الاستخدام",
      createdLabel: "تاريخ الإنشاء",
      updatedLabel: "آخر تعديل",
      favoriteTooltip: "إضافة للمفضلة",
      copyTooltip: "نسخ البرومبت",
      deleteTooltip: "حذف البرومبت",
      notepadTitle: "المفكرة السريعة",
      notepadSub: "مساحة عمل مخصصة للكتابة السريعة والاختبار السهل والمباشر للبرومبتات.",
      wordCount: "عدد الكلمات: {count}",
      charCount: "عدد الحروف: {count}",
      variablesDetected: "متغير مكتشف",
    },
    editor: {
      editPrompt: "تحرير البرومبت",
      newPrompt: "إنشاء برومبت جديد",
      subtitle: "إنشاء برومبت جديد أو تعديل برومبت موجود لتنظيمه في مكتبتك.",
      cancel: "إلغاء الإجراء",
      savePrompt: "حفظ البرومبت",
      promptContent: "محتوى البرومبت",
      enterDetails: "أدخل تفاصيل البرومبت وبياناته",
      autosaved: "تم الحفظ تلقائياً",
      titleLabel: "عنوان البرومبت *",
      titlePlaceholder: "كتابة خطة محتوى أسبوع كامل...",
      category: "التصنيف",
      tagsLabel: "الوسوم (مفصولة بفاصلة)",
      tagsPlaceholder: "تخطيط، محتوى، تسويق",
      authorLabel: "المنشئ",
      sourceLabel: "المصدر",
      contentLabel: "نص البرومبت *",
      contentSubtitle: "اكتب البرومبت واستخدم {variable} لإضافة متغيرات",
      modeEditor: "محرر",
      modePreview: "معاينة",
      enhanceGemini: "تحسين صياغة البرومبت عبر Gemini",
      geminiReady: "Gemini جاهز ومفعّل",
      enhanceOpenAI: "تحسين صياغة البرومبت عبر OpenAI",
      openaiReady: "OpenAI جاهز ومفعّل",
      enhanceClaude: "تحسين صياغة البرومبت عبر Claude",
      claudeReady: "Claude جاهز ومفعّل",
      tooltipUploadImage: "رفع صورة وإدراجها",
      tooltipUndo: "تراجع",
      tooltipRedo: "إعادة",
      fontSans: "IBM Plex Sans (عادي)",
      fontMono: "Monospace (كود)",
      fontSerif: "Serif (كلاسيك)",
      tooltipColor: "لون الخط",
      tooltipHighlight: "تمييز النص",
      clearFormat: "مسح التنسيق",
      clearHighlight: "مسح التمييز",
      headings: "العناوين",
      heading: "عنوان H",
      tooltipAlignRight: "محاذاة لليمين",
      tooltipAlignCenter: "محاذاة للوسط",
      tooltipAlignLeft: "محاذاة لليصار",
      tooltipAlignJustify: "ضبط النص",
      promptInsertLink: "أدخل الرابط:",
      editorPlaceholder: "اكتب البرومبت هنا... استخدم {variable} لإضافة متغيرات تفاعلية.",
      charCountText: "عدد الأحرف: {count}",
      aiEnhancing: "جاري تحسين الصياغة بالذكاء الاصطناعي...",
      noContentPreview: "_لا يوجد محتوى للمعاينة..._",
      notes: "ملاحظات",
      notesSubtitle: "ملاحظات داخلية حول كيفية استخدام هذا البرومبت",
      notesPlaceholder: "ملاحظات إضافية...",
      variables: "المتغيرات",
      variablesSubtitle: "استخدم المتغيرات لجعل البرومبت ديناميكياً",
      badgeText: "نص",
      noVariables: "لم يتم اكتشاف متغيرات بعد...",
      promptInfo: "معلومات البرومبت",
      createdAt: "تاريخ الإنشاء:",
      lastModified: "آخر تعديل:",
      creator: "المنشئ:",
      status: "الحالة:",
      usageEstimate: "تقدير الاستخدام",
      tokens: "الرموز (Tokens)",
      approximate: "تقدير تقريبي",
      charCountTitle: "عدد الأحرف",
      includingSpaces: "بما في ذلك المسافات",
      untitled: "بدون عنوان",
      successEnhance: "تم تحسين البرومبت بنجاح!",
      writePromptFirst: "يرجى كتابة نص البرومبت أولاً ليتمكن المساعد من تحسينه.",
      enhanceFailed: "فشل التحسين: ",
      secondsAgo: "منذ ثوان",
    },
    details: {
      promptNotFound: "البرومبت غير موجود",
      backToPrompts: "العودة للبرومبتات",
      duplicateSuccess: "تم تكرار البرومبت بنجاح!",
      title: "معاينة البرومبت",
      subtitle: "تعرض تفاصيل البرومبت ومعاينته قبل الاستخدام.",
      favorite: "مفضل",
      addToFavorites: "إضافة للمفضلة",
      duplicate: "تكرار",
      edit: "تحرير",
      copyPrompt: "نسخ البرومبت",
      promptText: "نص البرومبت",
      previewTextSubtitle: "معاينة النص مع إبراز المتغيرات",
      aiAssistantTitle: "مساعد الذكاء الاصطناعي الذكي",
      aiAssistantSubtitle: "اختر الوكيل المفضل واختبر البرومبت أو قم بتحسينه",
      improvePrompt: "تحسين البرومبت",
      askAiPlaceholder: "اسأل {provider} عن هذا البرومبت...",
      assistantResponse: "استجابة المساعد",
      clear: "مسح",
      copy: "نسخ",
      versionsTitle: "إصدارات البرومبت",
      creatorCol: "المنشئ",
      releaseDateCol: "تاريخ الإصدار",
      releaseEditCol: "تعديل الإصدار",
      noVersions: "لا توجد إصدارات سابقة محفوظة.",
      relatedPrompts: "برومبتات ذات صلة",
      noRelated: "لا توجد برومبتات ذات صلة.",
      category: "التصنيف",
      tags: "الوسوم",
      version: "الإصدار",
      usages: "الاستخدامات",
      source: "المصدر",
      dates: "التواريخ",
      createdAt: "تاريخ الإنشاء",
      lastUpdatedAt: "آخر تحديث",
      error: "خطأ: ",
    },
  },
  en: {
    common: {
      appName: "PromptVault",
      appSub: "Prompt Management System",
      back: "Back",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      cancel: "Cancel",
      confirm: "Confirm",
      confirmTitle: "Confirm Action",
      actions: "Actions",
      loading: "Loading...",
      noData: "No data available",
      searchPlaceholder: "Search title, content, tags, category, and notes...",
      ctrlK: "Ctrl+K",
      newPrompt: "New Prompt",
      success: "Success",
      warning: "Warning",
      danger: "Error",
      info: "Info",
      updateAvailable: "Update Available",
      updateMessage: "A new update is ready to install. Would you like to relaunch and install it now?",
      relaunch: "Relaunch",
      later: "Later",
      deleteConfirmTitle: "Are you sure?",
      deleteConfirmMessage: "This action cannot be undone once completed.",
      all: "All",
    },
    sidebar: {
      dashboard: "Dashboard",
      prompts: "Prompts",
      favorites: "Favorites",
      categories: "Categories",
      tags: "Tags",
      search: "Advanced Search",
      importExport: "Import / Export",
      backups: "Backups",
      settings: "Settings",
      dbStatus: "Database Status",
      status: "Status:",
      connected: "Connected",
      promptsCount: "Prompts:",
      storage: "Storage:",
      storageLocal: "Local",
      manageBackups: "Manage Backups",
    },
    header: {
      proMode: "Professional Mode",
      notepadMode: "Notepad Mode",
    },
    statusBar: {
      allSystemsGo: "All systems operational",
      syncLabel: "Sync: Today, 02:30 PM",
      spaceUsed: "Space Used: 256.8 MB of 5 GB (5%)",
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Quick operational overview of the local prompt library status.",
      totalPrompts: "Total Prompts",
      promptsSaved: "prompt saved",
      favorites: "Favorites",
      promptsFavorited: "prompt favorited",
      categories: "Categories",
      categoriesActive: "active category",
      tags: "Tags",
      tagsUsed: "tag used",
      mostUsed: "Most Used",
      mostUsedSub: "The most requested and invoked prompts in your workflows.",
      recentPrompts: "Recent Prompts",
      recentPromptsSub: "Latest additions to your local library.",
      recentEdits: "Recent Edits",
      recentEditsSub: "Recently updated prompts.",
      recentActivity: "Recent Activity",
      recentActivitySub: "Log of recent operations and activity on the system.",
      viewAllMostUsed: "View all most used prompts",
      viewAllPrompts: "View all prompts",
      viewAllActivity: "View all activity",
      noActivity: "No activity recorded yet.",
      times: {
        todayAgo: "Today, {min}m ago",
        todayAt: "Today, {time}",
        yesterdayAt: "Yesterday, {time}",
      },
      timesCount: "{count} times",
    },
    prompts: {
      title: "Prompts",
      subtitle: "Manage and browse all prompts saved in your library.",
      filterCategory: "Category",
      filterTag: "Tags",
      sortBy: "Sort By",
      searchLabel: "Search",
      searchPlaceholder: "Search...",
      allCategories: "All Categories",
      allTags: "All Tags",
      sortLastUpdated: "Last Updated",
      sortMostUsed: "Most Used",
      sortTitle: "Title",
      previewTitle: "Prompt Preview",
      unclassified: "Unclassified",
      lastUpdated: "Last Updated:",
      dateCreated: "Date Created:",
      usages: "Usages:",
      statusLabel: "Status:",
      statusActive: "Active",
      ownerLabel: "Owner:",
      ownerMe: "You",
      actionEdit: "Edit",
      actionCopy: "Copy",
      actionDuplicate: "Duplicate",
      actionFullVersion: "View Full Version",
      promptsCount: "{count} prompts",
      noResults: "No results matching your search...",
      showing: "Showing 1 - {count} of {total} prompts",
      copiedToast: "Prompt copied successfully!",
      duplicateToast: "Prompt duplicated successfully!",
    },
    favorites: {
      title: "Favorite Prompts",
      subtitle: "Quick access to your starred prompts.",
      noFavorites: "No favorite prompts added yet.",
    },
    categories: {
      title: "Categories",
      subtitle: "Organize prompts into custom domains and fields.",
      newCategory: "New Category",
      categoryNamePlaceholder: "Category Name (e.g. Programming, Creative Writing)",
      categoryDescPlaceholder: "Brief description of the category and its purpose...",
      editCategory: "Edit Category",
      addBtn: "Add New Category",
      saveBtn: "Save Changes",
      cancelBtn: "Cancel",
      nameLabel: "Category Name",
      descLabel: "Description",
      promptCount: "Prompts Count",
      createdDate: "Date Created",
      actions: "Actions",
      successAdd: "Category added successfully!",
      successUpdate: "Category updated successfully!",
      successDelete: "Category deleted successfully!",
    },
    tags: {
      title: "Tags",
      subtitle: "Add text labels to categorize prompts and facilitate quick searching.",
      newTag: "New Tag",
      tagNamePlaceholder: "Tag Name (e.g. python, copy_writing)",
      editTag: "Edit Tag",
      addBtn: "Add Tag",
      saveBtn: "Save Tag",
      cancelBtn: "Cancel",
      nameLabel: "Tag Name",
      usageCount: "Usage Count",
      actions: "Actions",
      successAdd: "Tag added successfully!",
      successUpdate: "Tag updated successfully!",
      successDelete: "Tag deleted successfully!",
    },
    search: {
      title: "Advanced Search",
      subtitle: "Search your prompt library accurately and effectively using advanced filters.",
      keywordLabel: "Keywords",
      keywordPlaceholder: "Search in title, content, or notes...",
      categoryLabel: "Target Category",
      tagLabel: "Tag",
      dateRangeLabel: "Date Range",
      allDates: "All Time",
      pastWeek: "Past Week",
      pastMonth: "Past Month",
      pastYear: "Past Year",
      searchBtn: "Execute Advanced Search",
      resetBtn: "Reset Filters",
      resultsTitle: "Advanced Search Results",
      noResults: "No results matching search conditions...",
      onlyFavorites: "Favorites Only",
      statusLabel: "Status",
      statusActive: "Active",
      statusArchived: "Archived",
      promptCol: "Prompt",
      categoryCol: "Category",
      actionsCol: "Actions",
      openDetails: "Open Details",
    },
    importExport: {
      title: "Import / Export Data",
      subtitle: "Backup or transfer your data to another device easily.",
      exportCardTitle: "Export Database",
      exportCardDesc: "Export all prompts, categories, and tags in a single JSON file.",
      exportBtn: "Export Data Now",
      importCardTitle: "Import Database",
      importCardDesc: "Merge or replace current database with an external JSON file.",
      importDragText: "Drag JSON file here or",
      importOrText: "or",
      importBtn: "Choose file from device",
      importSuccessToast: "Data imported and updated successfully!",
      importFailToast: "Selected file is invalid or corrupted.",
      exportSuccessToast: "Data exported successfully!",
      selectFile: "Click to select data file",
      changeFile: "Change File",
      chooseFile: "Choose File",
      supportedFormat: "Supports only exported JSON files",
      importOptions: "Import Options",
      skipDuplicates: "Skip duplicate prompts (by title)",
      startImport: "Start Import Process",
      exportScope: "Export Scope",
      allData: "All Data",
      onlyFavorites: "Favorites Only",
      fileFormat: "File Format",
      jsonFormatDesc: "Export full integrated data for later restoration",
      exportWarning: "Will export {count} prompts with all their categories and tags.",
      exportSelectedBtn: "Export Selected File",
      selectFileFirst: "Please select a file first.",
      invalidStructure: "Invalid file structure. File must contain a prompts list.",
      importSuccessCount: "Data imported successfully! Added {count} new prompts.",
      importFail: "Failed to read or parse file as valid JSON.",
      exportSuccess: "File exported successfully!",
    },
    backups: {
      title: "Backups",
      subtitle: "Manage backups and restore the database when needed.",
      autoBackups: "Auto Backups",
      manualBackups: "Manual Backups",
      restoreBtn: "Restore",
      deleteBtn: "Delete",
      sizeLabel: "Size",
      dateLabel: "Date & Time",
      typeLabel: "Backup Type",
      statusLabel: "Status",
      successStatus: "Success",
      restoreConfirmTitle: "Restore Backup",
      restoreConfirmMessage: "Are you sure you want to restore this backup? Current data will be completely replaced by the restored data.",
      restoreSuccessToast: "Backup restored successfully!",
      deleteSuccessToast: "Backup file deleted successfully!",
      createSuccessToast: "New backup created successfully!",
      historyTitle: "Backup History",
      historySub: "All backups created",
      failStatus: "Failed",
      noBackups: "No backups available currently.",
      deleteConfirmTitle: "Delete Backup",
      deleteConfirmMessage: "Are you sure you want to delete this backup?",
      createNowTitle: "Create Backup Now",
      createNowDesc: "Create an immediate backup and save it in the local database to restore it when needed.",
      runManualBackup: "Run Manual Backup",
      settingsTitle: "Backup Settings",
      settingsAuto: "Auto Backup",
      settingsFrequency: "Frequency",
      settingsRetention: "Retention",
      settingsRetentionVal: "{count} backups",
      settingsFrequencyVal: "Daily",
    },
    settings: {
      title: "Settings",
      subtitle: "Customize your PromptVault experience to suit your needs and preferences.",
      tabGeneral: "General",
      tabAI: "AI",
      tabCloud: "Cloud Sync",
      tabBackup: "Backups",
      tabShortcuts: "Shortcuts",
      tabAbout: "About",
      generalSettings: "General Settings",
      visualTheme: "Visual Theme",
      themeDesc: "Choose between light, dark, or system mode.",
      themeLight: "Light",
      themeDark: "Dark",
      themeSystem: "System",
      appLanguage: "Default App Language",
      languageDesc: "Specify the preferred language for the interface.",
      autosaveLabel: "Autosave",
      autosaveDesc: "Automatically save changes while writing in the editor.",
      autosaveIntervalLabel: "Autosave Interval",
      autosaveIntervalDesc: "Time interval between automatic saves (in minutes).",
      autosaveIntervalValue: "{val} minutes",
      promptPreviewLabel: "Show Prompt Preview",
      promptPreviewDesc: "Show quick preview cards for prompts while browsing.",
      tooltipsLabel: "Show Help Tooltips",
      tooltipsDesc: "Show small text guidelines when hovering over interface elements.",
      dbLocationLabel: "Database Location",
      dbLocationDesc: "The local directory where prompt data is stored. Data will be migrated automatically.",
      changePathBtn: "Change Path",
      pathChangeSuccess: "Database folder re-assigned successfully",
      pathChangeFail: "Failed to set database path",
      desktopOnlyWarning: "Changing database path is only available on desktop",
      aiTitle: "Integrated AI",
      aiDesc: "API integration allows you to optimize, test, and generate smart prompts directly in the app.",
      apiKeyActive: "Enabled & Active",
      geminiPlaceholder: "Enter Gemini API Key here...",
      openaiPlaceholder: "Enter OpenAI API Key here...",
      claudePlaceholder: "Enter Anthropic API Key here...",
      testBtn: "Test {provider} Connection",
      keyStoredNote: "Keys are stored locally on your device only and are never shared with third parties.",
      testSuccessToast: "{provider} API Key validated successfully, connection is healthy!",
      testInputWarning: "Please enter an API Key first before testing",
      cloudTitle: "Cloud Sync",
      googleDriveDesc: "Sync data via Google Drive",
      googleDriveTokenPlaceholder: "Enter Google Access Token...",
      testCloudBtn: "Test Cloud Connection",
      cloudLinkBtn: "Link Account Now",
      cloudUnlinkBtn: "Unlink Account",
      dropboxDesc: "Sync data via Dropbox",
      dropboxTokenPlaceholder: "Enter Dropbox Access Token...",
      backupTitle: "Security and Backups",
      backupEnableLabel: "Enable Auto Backup",
      backupEnableDesc: "Create backups of your data periodically and automatically.",
      backupFreqLabel: "Backup Frequency",
      backupFreqDesc: "Preferred backup repeat rate.",
      backupFreqDaily: "Daily",
      backupFreqWeekly: "Weekly",
      backupFreqMonthly: "Monthly",
      backupRetentionLabel: "Max Saved Backups",
      backupRetentionDesc: "Number of backup files retained before deleting the oldest.",
      localFirstNote: "All your data, prompts, and settings are stored completely locally (Local-first). You can start an immediate backup at any time.",
      backupNowBtn: "Perform Immediate Backup",
      manageBackupsBtn: "Manage Previous Backups",
      backupSuccessToast: "New backup created successfully locally",
      shortcutsTitle: "Keyboard Shortcuts",
      shortcutsDesc: "Use the following shortcuts to speed up your daily tasks.",
      shortcutSearch: "Open Quick Search window",
      shortcutNewPrompt: "Create a new prompt",
      shortcutSave: "Save current prompt in editor",
      shortcutToggleSidebar: "Show / hide sidebar menu",
      aboutTitle: "About Program",
      aboutDesc: "Smart local prompt manager to save, manage, and develop AI prompts.",
      aboutVersion: "Version: v1.2.1",
      aboutAuthor: "Developer: Sufyan Aser",
    },
    notepad: {
      searchPlaceholder: "Search prompts...",
      allPrompts: "All Prompts",
      noPrompts: "No prompts available...",
      noCategoryPrompts: "No prompts in this category...",
      newPromptBtn: "Create New Prompt",
      editMode: "Edit",
      previewMode: "Preview",
      titlePlaceholder: "New Prompt Title...",
      contentPlaceholder: "Write the prompt here... Use {variables} if you need dynamic fields.",
      promptSaved: "Prompt saved successfully!",
      promptAutoSaved: "Autosaved",
      variablesLabel: "Detected Variables",
      noVariables: "No variables detected in the current text.",
      clickToInsert: "Click variable to fill it",
      tagsLabel: "Tags",
      categoryLabel: "Category",
      usageCountLabel: "Usage",
      createdLabel: "Date Created",
      updatedLabel: "Last Updated",
      favoriteTooltip: "Add to favorites",
      copyTooltip: "Copy prompt",
      deleteTooltip: "Delete prompt",
      notepadTitle: "Quick Notepad",
      notepadSub: "A dedicated workspace for quick writing and easy testing of prompts.",
      wordCount: "Word count: {count}",
      charCount: "Character count: {count}",
      variablesDetected: "variable detected",
    },
    editor: {
      editPrompt: "Edit Prompt",
      newPrompt: "Create New Prompt",
      subtitle: "Create a new prompt or modify an existing prompt to organize it in your library.",
      cancel: "Cancel",
      savePrompt: "Save Prompt",
      promptContent: "Prompt Content",
      enterDetails: "Enter prompt details and information",
      autosaved: "Autosaved",
      titleLabel: "Prompt Title *",
      titlePlaceholder: "Write a week's worth of content plan...",
      category: "Category",
      tagsLabel: "Tags (separated by comma)",
      tagsPlaceholder: "planning, content, marketing",
      authorLabel: "Creator",
      sourceLabel: "Source",
      contentLabel: "Prompt Text *",
      contentSubtitle: "Write the prompt and use {variable} to add variables",
      modeEditor: "Editor",
      modePreview: "Preview",
      enhanceGemini: "Enhance prompt formulation via Gemini",
      geminiReady: "Gemini is ready and enabled",
      enhanceOpenAI: "Enhance prompt formulation via OpenAI",
      openaiReady: "OpenAI is ready and enabled",
      enhanceClaude: "Enhance prompt formulation via Claude",
      claudeReady: "Claude is ready and enabled",
      tooltipUploadImage: "Upload and insert image",
      tooltipUndo: "Undo",
      tooltipRedo: "Redo",
      fontSans: "IBM Plex Sans (Normal)",
      fontMono: "Monospace (Code)",
      fontSerif: "Serif (Classic)",
      tooltipColor: "Text Color",
      tooltipHighlight: "Highlight Text",
      clearFormat: "Clear Formatting",
      clearHighlight: "Clear Highlight",
      headings: "Headings",
      heading: "Heading H",
      tooltipAlignRight: "Align Right",
      tooltipAlignCenter: "Align Center",
      tooltipAlignLeft: "Align Left",
      tooltipAlignJustify: "Align Justify",
      promptInsertLink: "Enter URL:",
      editorPlaceholder: "Write the prompt here... Use {variable} to add interactive variables.",
      charCountText: "Character count: {count}",
      aiEnhancing: "Enhancing phrasing with AI...",
      noContentPreview: "_No content to preview..._",
      notes: "Notes",
      notesSubtitle: "Internal notes on how to use this prompt",
      notesPlaceholder: "Additional notes...",
      variables: "Variables",
      variablesSubtitle: "Use variables to make the prompt dynamic",
      badgeText: "Text",
      noVariables: "No variables detected yet...",
      promptInfo: "Prompt Info",
      createdAt: "Created At:",
      lastModified: "Last Modified:",
      creator: "Creator:",
      status: "Status:",
      usageEstimate: "Usage Estimate",
      tokens: "Tokens",
      approximate: "Approximate estimate",
      charCountTitle: "Character Count",
      includingSpaces: "Including spaces",
      untitled: "Untitled",
      successEnhance: "Prompt enhanced successfully!",
      writePromptFirst: "Please write the prompt text first for the assistant to enhance.",
      enhanceFailed: "Enhancement failed: ",
      secondsAgo: "seconds ago",
    },
    details: {
      promptNotFound: "Prompt not found",
      backToPrompts: "Back to Prompts",
      duplicateSuccess: "Prompt duplicated successfully!",
      title: "Prompt Preview",
      subtitle: "Displays prompt details and preview before use.",
      favorite: "Favorite",
      addToFavorites: "Add to Favorites",
      duplicate: "Duplicate",
      edit: "Edit",
      copyPrompt: "Copy Prompt",
      promptText: "Prompt Text",
      previewTextSubtitle: "Preview text with highlighted variables",
      aiAssistantTitle: "Smart AI Assistant",
      aiAssistantSubtitle: "Select preferred agent and test or improve prompt",
      improvePrompt: "Improve Prompt",
      askAiPlaceholder: "Ask {provider} about this prompt...",
      assistantResponse: "Assistant Response",
      clear: "Clear",
      copy: "Copy",
      versionsTitle: "Prompt Versions",
      creatorCol: "Creator",
      releaseDateCol: "Release Date",
      releaseEditCol: "Version Edit",
      noVersions: "No previous versions saved.",
      relatedPrompts: "Related Prompts",
      noRelated: "No related prompts.",
      category: "Category",
      tags: "Tags",
      version: "Version",
      usages: "Usages",
      source: "Source",
      dates: "Dates",
      createdAt: "Date Created",
      lastUpdatedAt: "Last Updated",
      error: "Error: ",
    },
  },
};
