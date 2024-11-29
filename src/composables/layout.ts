import { computed, reactive, Ref } from 'vue'
import { useToggle } from '@vueuse/core';

const [isMenuShown, toggleMenu] = useToggle();

const layoutState = reactive({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    activeMenuItem: null
})

export function useLayout() {
    const setActiveMenuItem = (item: Ref) => {
        layoutState.activeMenuItem = item.value || item;
    }

    const onMenuToggle = () => {
        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
        }
    };

    const resetMenu = () => {
        layoutState.overlayMenuActive = false;
        layoutState.staticMenuMobileActive = false;
        layoutState.menuHoverActive = false;
    };

    const isSidebarActive = computed(() => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive);


    return {
        isMenuShown,
        toggleMenu,
        setActiveMenuItem,
        onMenuToggle,
        resetMenu,
        isSidebarActive,
        layoutState,
    }
}