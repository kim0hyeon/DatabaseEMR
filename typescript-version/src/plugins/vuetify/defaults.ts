export default {
  IconBtn: {
    icon: true,
    color: 'default',
    variant: 'text',
    VIcon: {
      size: 24,
    },
  },
  VAlert: {
    VBtn: {
      color: undefined,
    },
  }, // 회색줄로 강조함
  VAvatar: {
    // ℹ️ Remove after next release
    variant: 'flat',
    VIcon: {
      size: 24,
    },
  },
  VBadge: {
    // set v-badge default color to primary
    color: 'primary',
  },
  VBtn: {
    // set v-btn default color to primary
    color: 'primary',
  },
  VChip: {
    elevation: 0,
  },
  VList: {
    activeColor: 'primary',
  },
  VPagination: {
    activeColor: 'primary',
  }, // 1페이지, 2페이지와 같은 방식으로 페이지를 나눌 수 있음
  VTabs: {
    // set v-tabs default color to primary
    color: 'primary',
    VSlideGroup: {
      showArrows: true,
    },
  }, // 엔터 한번 누르는듯?
  VTooltip: {
    // set v-tooltip default location to top
    location: 'top',
  },
  VCheckboxBtn: {
    color: 'primary',
    hideDetails: 'auto',
  },
  VCheckbox: {
    // set v-checkbox default color to primary
    color: 'primary',
    hideDetails: 'auto',
  },
  VRadioGroup: {
    color: 'primary',
    hideDetails: 'auto',
  },
  VRadio: {
    color: 'primary',
    hideDetails: 'auto',
  },
  VSelect: {
    variant: 'outlined',
    color: 'primary',
    hideDetails: 'auto',
  }, // 클릭해 리스트들중 하나를 고를 수 있음
  VRangeSlider: {
    // set v-range-slider default color to primary
    color: 'primary',
    density: 'comfortable',
    thumbLabel: true,
    hideDetails: 'auto',
  }, // ??
  VRating: {
    // set v-rating default color to primary
    color: 'rgba(var(--v-theme-on-background),0.23)',
    activeColor: 'warning',
  }, // 별이 다섯개, 평가할 수 있게 하는 것 같음
  VProgressCircular: {
    // set v-progress-circular default color to primary
    color: 'primary',
  }, // 몰겠음
  VSlider: {
    // set v-slider default color to primary
    color: 'primary',
    hideDetails: 'auto',
  }, // 슬라이드로 움직이는 버튼?
  VTextField: {
    variant: 'outlined',
    color: 'primary',
    hideDetails: 'auto',
  }, // 텍스트를 적을 수 있는 공간, 
  VAutocomplete: {
    variant: 'outlined',
    color: 'primary',
    hideDetails: 'auto',
  }, // 자동완성 기능을 가진 박스
  VCombobox: {
    variant: 'outlined',
    color: 'primary',
    hideDetails: 'auto',
  }, // 이건 뭐지
  VFileInput: {
    variant: 'outlined',
    color: 'primary',
    hideDetails: 'auto',
  }, // 파일을 불러올 수 있음 (파일 이름 표시)
  VTextarea: {
    variant: 'outlined',
    color: 'primary',
    hideDetails: 'auto',
  }, // 텍스트를 적을 수 있는 공간, 마우스로 늘리거나 줄일 수 있음
  VSwitch: {
    // set v-switch default color to primary
    color: 'primary',
    hideDetails: 'auto',
  }, // 좌우 슬라이드 형식 버튼
}
