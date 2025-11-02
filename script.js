document.addEventListener("DOMContentLoaded", () => {
  const tablist = document.querySelector("[role='tablist']");
  const tabs = Array.from(tablist.querySelectorAll("[role='tab']"));
  const panels = tabs.map((tab) =>
    document.getElementById(`panel-${tab.dataset.tab}`)
  );
  const menuToggle = document.querySelector(".menu-toggle");

  const activateTab = (newTab) => {
    tabs.forEach((tab) => {
      const isActive = tab === newTab;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    panels.forEach((panel) => {
      const shouldShow = panel.id === `panel-${newTab.dataset.tab}`;
      if (shouldShow) {
        panel.hidden = false;
        panel.classList.add("is-active");
        panel.removeAttribute("tabindex");
      } else {
        panel.hidden = true;
        panel.classList.remove("is-active");
        panel.setAttribute("tabindex", "-1");
      }
    });
  };

  const focusTab = (index) => {
    const tab = tabs[index];
    if (tab) {
      tab.focus();
      activateTab(tab);
    }
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activateTab(tab);
      if (window.innerWidth <= 880) {
        setTabsCollapsed(true);
      }
    });

    tab.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          focusTab((index + 1) % tabs.length);
          break;
        case "ArrowLeft":
          event.preventDefault();
          focusTab((index - 1 + tabs.length) % tabs.length);
          break;
        case "Home":
          event.preventDefault();
          focusTab(0);
          break;
        case "End":
          event.preventDefault();
          focusTab(tabs.length - 1);
          break;
        default:
          break;
      }
    });
  });

  const setTabsCollapsed = (collapsed) => {
    if (window.innerWidth > 880) {
      tablist.dataset.collapsed = "false";
      menuToggle.setAttribute("aria-expanded", "true");
      return;
    }

    tablist.dataset.collapsed = collapsed ? "true" : "false";
    menuToggle.setAttribute("aria-expanded", String(!collapsed));
  };

  menuToggle.addEventListener("click", () => {
    const isCollapsed = tablist.dataset.collapsed !== "false";
    setTabsCollapsed(!isCollapsed);
  });

  const handleResize = () => {
    if (window.innerWidth > 880) {
      setTabsCollapsed(false);
    } else {
      setTabsCollapsed(true);
    }
  };

  window.addEventListener("resize", handleResize);

  // Initialize state
  activateTab(tabs.find((tab) => tab.classList.contains("is-active")) ?? tabs[0]);
  handleResize();
});
