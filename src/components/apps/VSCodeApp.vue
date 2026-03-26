<template>
  <div class="vscode-app">
    <!-- 活动栏 (Activity Bar) -->
    <div class="activity-bar">
      <div class="activity-top">
        <div class="activity-item" :class="{ active: !sidebarCollapsed }" @click="toggleSidebar" title="Explorer (Ctrl+Shift+E)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 22.5H17.595C17.07 23.4 16.11 24 15 24H7.5C4.185 24 1.5 21.315 1.5 18V6C1.5 4.89 2.1 3.93 3 3.405V18C3 20.475 5.025 22.5 7.5 22.5ZM21 8.121V18C21 19.6545 19.6545 21 18 21H7.5C5.8455 21 4.5 19.6545 4.5 18V3C4.5 1.3455 5.8455 0 7.5 0H12.879C13.4715 0 14.0505 0.24 14.4705 0.6585L20.3415 6.5295C20.766 6.954 21 7.5195 21 8.121ZM13.5 6.75C13.5 7.164 13.8375 7.5 14.25 7.5H19.1895L13.5 1.8105V6.75ZM19.5 18V9H14.25C13.0095 9 12 7.9905 12 6.75V1.5H7.5C6.672 1.5 6 2.1735 6 3V18C6 18.8265 6.672 19.5 7.5 19.5H18C18.828 19.5 19.5 18.8265 19.5 18Z"/></svg>
        </div>
        <div class="activity-item" title="Search (Ctrl+Shift+F)">
          <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M10.0195 10.7266C9.06578 11.5217 7.83875 12 6.5 12C3.46243 12 1 9.53757 1 6.5C1 3.46243 3.46243 1 6.5 1C9.53757 1 12 3.46243 12 6.5C12 7.83875 11.5217 9.06578 10.7266 10.0195L13.8535 13.1464C14.0488 13.3417 14.0488 13.6583 13.8535 13.8536C13.6583 14.0488 13.3417 14.0488 13.1464 13.8536L10.0195 10.7266ZM11 6.5C11 4.01472 8.98528 2 6.5 2C4.01472 2 2 4.01472 2 6.5C2 8.98528 4.01472 11 6.5 11C8.98528 11 11 8.98528 11 6.5Z"/></svg>
        </div>
        <div class="activity-item" title="Source Control (Ctrl+Shift+G)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 8.25C21 6.1815 19.3185 4.5 17.25 4.5C15.1815 4.5 13.5 6.1815 13.5 8.25C13.5 10.023 14.739 11.5035 16.395 11.892C16.116 12.819 15.2655 13.5 14.25 13.5H9.75C8.9025 13.5 8.1285 13.7925 7.5 14.268V7.4235C9.21 7.0755 10.5 5.5605 10.5 3.75C10.5 1.6815 8.8185 0 6.75 0C4.6815 0 3 1.6815 3 3.75C3 5.562 4.29 7.0755 6 7.4235V16.575C4.29 16.923 3 18.438 3 20.2485C3 22.317 4.6815 23.9985 6.75 23.9985C8.8185 23.9985 10.5 22.317 10.5 20.2485C10.5 18.4755 9.261 16.995 7.605 16.6065C7.884 15.6795 8.7345 14.9985 9.75 14.9985H14.25C16.0845 14.9985 17.61 13.6725 17.931 11.9295C19.674 11.607 21 10.0845 21 8.25ZM4.5 3.75C4.5 2.5095 5.5095 1.5 6.75 1.5C7.9905 1.5 9 2.5095 9 3.75C9 4.9905 7.9905 6 6.75 6C5.5095 6 4.5 4.9905 4.5 3.75ZM9 20.25C9 21.4905 7.9905 22.5 6.75 22.5C5.5095 22.5 4.5 21.4905 4.5 20.25C4.5 19.0095 5.5095 18 6.75 18C7.9905 18 9 19.0095 9 20.25ZM17.25 10.5C16.0095 10.5 15 9.4905 15 8.25C15 7.0095 16.0095 6 17.25 6C18.4905 6 19.5 7.0095 19.5 8.25C19.5 9.4905 18.4905 10.5 17.25 10.5Z"/></svg>
        </div>
        <div class="activity-item" title="Extensions (Ctrl+Shift+X)">
          <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15 4.95703C15 4.58711 14.8563 4.24054 14.5949 3.97992L12.0096 1.39234C11.4879 0.86922 10.5788 0.86922 10.0571 1.39234L8 3.45119V3.32321C8 2.55068 7.37187 1.922 6.6 1.922H2.4C1.62813 1.922 1 2.55068 1 3.32321V13.5988C1 14.3713 1.62813 15 2.4 15H12.6667C13.4385 15 14.0667 14.3713 14.0667 13.5988V9.39514C14.0667 8.62261 13.4385 7.99393 12.6667 7.99393H12.5379L14.5949 5.93508C14.8553 5.67445 15 5.32602 15 4.95703ZM2.4 2.85521H6.6C6.85667 2.85521 7.06667 3.06446 7.06667 3.32228V7.99299H1.93333V3.32228C1.93333 3.06446 2.14333 2.85521 2.4 2.85521ZM1.93333 13.5979V8.92714H7.06667V14.0649H2.4C2.14333 14.0649 1.93333 13.8547 1.93333 13.5979ZM13.1333 9.39421V13.5979C13.1333 13.8547 12.9233 14.0649 12.6667 14.0649H8V8.92714H12.6667C12.9233 8.92714 13.1333 9.13638 13.1333 9.39421ZM8 7.99299V6.46287L9.5288 7.99299H8ZM13.9351 5.2737L11.3488 7.86221C11.1789 8.03223 10.8859 8.03223 10.716 7.86221L8.12973 5.2737C8.0448 5.18963 7.99813 5.07753 7.99813 4.95796C7.99813 4.83839 8.0448 4.7263 8.12973 4.64129L10.716 2.05278C10.8009 1.96777 10.9129 1.92106 11.0324 1.92106C11.1519 1.92106 11.2639 1.96777 11.3488 2.05278L13.9351 4.64129C14.02 4.72536 14.0667 4.83746 14.0667 4.95703C14.0667 5.0766 14.02 5.1887 13.9351 5.2737Z"/></svg>
        </div>
      </div>
      <div class="activity-bottom">
        <div class="activity-item" title="Accounts">
          <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 2C4.686 2 2 4.686 2 8C2 11.314 4.686 14 8 14C11.314 14 14 11.314 14 8C14 4.686 11.314 2 8 2ZM1 8C1 4.134 4.134 1 8 1C11.866 1 15 4.134 15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8ZM8 12.25C9.933 12.25 11.5 11.036 11.5 9.214C11.5 8.543 10.956 8 10.286 8H5.715C5.044 8 4.501 8.544 4.501 9.214C4.501 11.035 6.068 12.25 8.001 12.25H8ZM8 7.25C9.036 7.25 9.875 6.411 9.875 5.375C9.875 4.339 9.036 3.5 8 3.5C6.964 3.5 6.125 4.339 6.125 5.375C6.125 6.411 6.964 7.25 8 7.25Z"/></svg>
        </div>
        <div class="activity-item" title="Manage">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 9C10.3425 9 9.00002 10.3425 9.00002 12C9.00002 13.6575 10.3425 15 12 15C13.6575 15 15 13.6575 15 12C15 10.3425 13.6575 9 12 9ZM12 13.5C11.172 13.5 10.5 12.828 10.5 12C10.5 11.172 11.172 10.5 12 10.5C12.828 10.5 13.5 11.172 13.5 12C13.5 12.828 12.828 13.5 12 13.5ZM21.8475 14.5725L19.9185 12.942C19.8675 12.8985 19.8195 12.8505 19.776 12.7995C19.332 12.279 19.3965 11.5005 19.9185 11.058L21.8475 9.4275C22.0395 9.2655 22.113 9.0045 22.0365 8.766C21.579 7.3545 20.823 6.06 19.8285 4.962C19.7085 4.83 19.5405 4.758 19.368 4.758C19.2975 4.758 19.227 4.77 19.1595 4.794L16.779 5.6415C16.716 5.664 16.65 5.682 16.584 5.694C16.509 5.7075 16.434 5.715 16.3605 5.715C15.7725 5.715 15.2505 5.298 15.141 4.701L14.6865 2.223C14.6415 1.977 14.451 1.782 14.205 1.7295C13.485 1.5765 12.7485 1.5 12.0015 1.5C11.2545 1.578 10.5165 1.578 9.79652 1.7295C9.55052 1.782 9.36002 1.977 9.31502 2.223L8.86202 4.701C8.85002 4.767 8.83202 4.8315 8.80952 4.8945C8.62802 5.4 8.15102 5.715 7.64102 5.715C7.50302 5.715 7.36202 5.691 7.22402 5.643L4.84352 4.7955C4.77602 4.7715 4.70402 4.7595 4.63502 4.7595C4.46252 4.7595 4.29452 4.8315 4.17452 4.9635C3.17852 6.0615 2.42402 7.356 1.96502 8.7675C1.88702 9.006 1.96202 9.267 2.15402 9.429L4.08302 11.0595C4.13402 11.103 4.18202 11.151 4.22552 11.202C4.66952 11.7225 4.60502 12.501 4.08302 12.9435L2.15402 14.574C1.96202 14.736 1.88852 14.997 1.96502 15.2355C2.42252 16.647 3.17852 17.9415 4.17452 19.0395C4.29452 19.1715 4.46252 19.2435 4.63502 19.2435C4.70552 19.2435 4.77602 19.2315 4.84352 19.2075L7.22402 18.36C7.28702 18.3375 7.35302 18.3195 7.41902 18.3075C7.49402 18.294 7.56902 18.288 7.64252 18.288C8.23052 18.288 8.75252 18.705 8.86202 19.302L9.31502 21.78C9.36002 22.026 9.55052 22.221 9.79652 22.2735C10.5165 22.4265 11.2545 22.503 12.0015 22.503C12.7485 22.503 13.4865 22.425 14.205 22.2735C14.451 22.221 14.6415 22.026 14.6865 21.78L15.141 19.302C15.153 19.236 15.171 19.1715 15.1935 19.1085C15.375 18.603 15.852 18.288 16.362 18.288C16.5 18.288 16.641 18.312 16.779 18.36L19.158 19.2075C19.227 19.2315 19.2975 19.2435 19.3665 19.2435C19.539 19.2435 19.707 19.1715 19.827 19.0395C20.823 17.9415 21.5775 16.647 22.035 15.2355C22.113 14.997 22.038 14.736 21.846 14.574L21.8475 14.5725ZM19.092 17.589L17.2815 16.944C16.9845 16.839 16.6755 16.785 16.362 16.785C15.2085 16.785 14.1705 17.514 13.782 18.5985C13.731 18.738 13.6935 18.882 13.6665 19.029L13.3215 20.9055C12.8865 20.9685 12.444 21 12.0015 21C11.559 21 11.1165 20.9685 10.68 20.904L10.3365 19.0275C10.098 17.727 8.96552 16.7835 7.64252 16.7835C7.48052 16.7835 7.31552 16.7985 7.14902 16.8285C7.00352 16.8555 6.86102 16.893 6.72002 16.9425L4.90952 17.5875C4.35752 16.896 3.91652 16.1385 3.59102 15.321L5.05202 14.0865C5.61152 13.614 5.95202 12.951 6.01202 12.222C6.07202 11.493 5.84252 10.785 5.36702 10.227C5.27102 10.1145 5.16452 10.008 5.05202 9.912L3.59102 8.6775C3.91652 7.86 4.35752 7.101 4.90952 6.411L6.72002 7.056C7.01702 7.161 7.32602 7.215 7.64102 7.215C8.79452 7.215 9.83252 6.486 10.221 5.4015C10.272 5.2605 10.3095 5.1165 10.3365 4.971L10.68 3.0945C11.1165 3.0315 11.559 2.9985 12.0015 2.9985C12.444 2.9985 12.8865 3.03 13.3215 3.093L13.665 4.9695C13.9035 6.27 15.036 7.2135 16.359 7.2135C16.521 7.2135 16.686 7.1985 16.851 7.1685C16.9965 7.1415 17.1405 7.104 17.2815 7.0545L19.092 6.4095C19.644 7.0995 20.085 7.8585 20.4105 8.676L18.951 9.9105C18.3915 10.383 18.0495 11.046 17.991 11.775C17.931 12.504 18.1605 13.2135 18.636 13.77C18.7335 13.884 18.8385 13.989 18.9525 14.085L20.4135 15.3195C20.088 16.137 19.647 16.896 19.095 17.586L19.092 17.589Z"/></svg>
        </div>
      </div>
    </div>

    <!-- 侧边栏 (Explorer) -->
    <div class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="sidebar-title">EXPLORER</div>
        <div class="sidebar-actions">
          <button class="action-btn" title="New File" @click="createNewFile">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <path d="M9 1h4.5v14H2.5V3.5L6 1h3zm0 0v2.5h-3"/>
              <path d="M8 6v6M5 9h6"/>
            </svg>
          </button>
          <button class="collapse-btn" @click="toggleSidebar" title="Toggle Sidebar">
            <span>{{ sidebarCollapsed ? '›' : '‹' }}</span>
          </button>
        </div>
      </div>
      
      <div v-if="!sidebarCollapsed" class="file-tree">
        <!-- Section: Workspace -->
        <div class="section-header" @click="toggleFolder('root')">
          <div class="section-arrow" :class="{ 'expanded': expandedFolders.has('root') }">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6 4l4 4-4 4" />
            </svg>
          </div>
          <span class="section-name">{{ workspaceName }}</span>
          <div class="section-actions" v-if="currentFolderPath && currentFolderPath !== 'macos_web/'">
            <button class="section-action-btn" title="关闭工作区" @click.stop="closeWorkspace">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div v-if="expandedFolders.has('root')" class="tree-children workspace-content">
          <div 
            v-for="file in files" 
            :key="file.id"
            class="tree-item file"
            :class="{ active: activeFile?.id === file.id }"
            @click="openFile(file)"
          >
            <span class="icon" v-html="getFileIcon(file.name)"></span>
            <span class="name">{{ file.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主编辑区域 -->
    <div class="main-area">
      <!-- 标签栏 -->
      <div class="tabs-bar-container">
        <div class="tabs-bar">
          <div 
            v-for="tab in openTabs" 
            :key="tab.id"
            class="tab"
            :class="{ active: activeFile?.id === tab.id }"
            @click="switchTab(tab)"
          >
            <span class="tab-icon" v-html="getFileIcon(tab.name)"></span>
            <span class="tab-name">{{ tab.name }}</span>
            <button class="close-btn" @click.stop="closeTab(tab)">×</button>
          </div>
        </div>
        <div class="editor-actions" v-if="editorActions.length > 0">
          <button 
            v-for="action in editorActions" 
            :key="action.id"
            class="editor-action-btn" 
            :title="action.title" 
            @click="action.handler"
            v-html="action.icon"
          >
          </button>
        </div>
      </div>

      <!-- 编辑器容器 -->
      <div class="editor-container">
        <div v-if="!activeFile" class="welcome-screen">
          <div class="welcome-content">
            <svg class="vscode-logo" viewBox="0 0 256 256" fill="none">
              <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="256" height="256">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M181.534 254.252C185.566 255.823 190.164 255.722 194.234 253.764L246.94 228.403C252.478 225.738 256 220.132 256 213.983V42.0181C256 35.8689 252.478 30.2638 246.94 27.5988L194.234 2.23681C188.893 -0.333132 182.642 0.296344 177.955 3.70418C177.285 4.191 176.647 4.73454 176.049 5.33354L75.149 97.3862L31.1992 64.0247C27.1079 60.9191 21.3853 61.1735 17.5855 64.63L3.48936 77.4525C-1.15853 81.6805 -1.16386 88.9926 3.47785 93.2274L41.5926 128L3.47785 162.773C-1.16386 167.008 -1.15853 174.32 3.48936 178.548L17.5855 191.37C21.3853 194.827 27.1079 195.081 31.1992 191.976L75.149 158.614L176.049 250.667C177.645 252.264 179.519 253.467 181.534 254.252ZM192.039 69.8853L115.479 128L192.039 186.115V69.8853Z" fill="white"/>
              </mask>
              <g mask="url(#mask0)">
                <path d="M246.94 27.6383L194.193 2.24138C188.088 -0.698302 180.791 0.541721 175.999 5.33332L3.32371 162.773C-1.32082 167.008 -1.31548 174.32 3.33523 178.548L17.4399 191.37C21.2421 194.827 26.9682 195.081 31.0619 191.976L239.003 34.2269C245.979 28.9347 255.999 33.9103 255.999 42.6667V42.0543C255.999 35.9078 252.478 30.3047 246.94 27.6383Z" fill="#0065A9"/>
                <g filter="url(#filter0_d)">
                  <path d="M246.94 228.362L194.193 253.759C188.088 256.698 180.791 255.458 175.999 250.667L3.32371 93.2272C-1.32082 88.9925 -1.31548 81.6802 3.33523 77.4523L17.4399 64.6298C21.2421 61.1733 26.9682 60.9188 31.0619 64.0245L239.003 221.773C245.979 227.065 255.999 222.09 255.999 213.333V213.946C255.999 220.092 252.478 225.695 246.94 228.362Z" fill="#007ACC"/>
                </g>
                <g filter="url(#filter1_d)">
                  <path d="M194.196 253.763C188.089 256.7 180.792 255.459 176 250.667C181.904 256.571 192 252.389 192 244.039V11.9606C192 3.61057 181.904 -0.571175 176 5.33321C180.792 0.541166 188.089 -0.700607 194.196 2.23648L246.934 27.5985C252.476 30.2635 256 35.8686 256 42.0178V213.983C256 220.132 252.476 225.737 246.934 228.402L194.196 253.763Z" fill="#1F9CF0"/>
                </g>
              </g>
              <defs>
                <filter id="filter0_d" x="-21.4896" y="40.5225" width="298.822" height="236.149" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                  <feOffset/>
                  <feGaussianBlur stdDeviation="10.6667"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                  <feBlend mode="overlay" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                </filter>
                <filter id="filter1_d" x="154.667" y="-20.6735" width="122.667" height="297.347" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                  <feOffset/>
                  <feGaussianBlur stdDeviation="10.6667"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                  <feBlend mode="overlay" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                </filter>
              </defs>
            </svg>
            <p class="welcome-text">Visual Studio Code</p>
            <button class="open-folder-btn" @click="openFinder">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M14.5 3H7.71l-.85-.85L6.51 2h-5l-.5.5v11l.5.5h13l.5-.5v-10L14.5 3zm-.51 8.49V13h-12V7h4.49l.35-.15.86-.86H14v1.5l-.01 4zm0-6.49h-6.5l-.35.15-.86.86H2v-3h4.29l.85.85.36.15H14l-.01.99z"/>
              </svg>
              打开文件夹
            </button>
          </div>
        </div>

        <!-- 图片预览 -->
        <div v-else-if="isImage(activeFile.name)" class="image-preview">
          <div class="image-container">
            <img :src="getImageUrl(activeFile)" :alt="activeFile.name" draggable="false" />
          </div>
        </div>

        <!-- Monaco Editor 容器 -->
        <div v-show="activeFile && !isImage(activeFile.name)" class="monaco-host" ref="editorContainer"></div>
      </div>

      <!-- 状态栏 -->
      <div class="status-bar">
        <div class="status-left">
          <span v-if="activeFile">{{ getLanguageMode(activeFile.name) }}</span>
          <span v-if="activeFile && !isImage(activeFile.name)">行 {{ cursorPosition.line }}, 列 {{ cursorPosition.column }}</span>
          <span v-if="activeFile && isImage(activeFile.name)">图片预览</span>
        </div>
        <div class="status-right">
          <span v-if="!activeFile || !isImage(activeFile.name)">UTF-8</span>
          <span v-if="!activeFile || !isImage(activeFile.name)">LF</span>
        </div>
      </div>
    </div>

    <!-- 文件选择对话框 -->
    <div v-if="showFileDialog" class="file-dialog-overlay" @click.self="closeFileDialog">
      <div class="file-dialog">
        <!-- 对话框标题栏 -->
        <div class="dialog-header">
          <div class="dialog-title">打开文件夹或文件</div>
          <button class="dialog-close" @click="closeFileDialog">×</button>
        </div>

        <!-- 对话框工具栏 -->
        <div class="dialog-toolbar">
          <button class="nav-btn" :disabled="!canGoBackDialog" @click="goBackDialog">◀</button>
          <button class="nav-btn" :disabled="!canGoForwardDialog" @click="goForwardDialog">▶</button>
          <div class="dialog-path">
            <span 
              v-for="(crumb, index) in dialogBreadcrumbs" 
              :key="index" 
              class="path-item"
              @click="navigateToDialogCrumb(index)"
            >
              {{ crumb }}
              <span v-if="index < dialogBreadcrumbs.length - 1" class="path-separator">▶</span>
            </span>
          </div>
        </div>

        <!-- 对话框主体 -->
        <div class="dialog-body">
          <!-- 侧边栏 -->
          <div class="dialog-sidebar">
            <div class="sidebar-section">
              <div class="section-title">快捷访问</div>
              <div
                v-for="fav in dialogFavorites"
                :key="fav.id"
                class="sidebar-item"
                :class="{ active: dialogCurrentPath === fav.path }"
                @click="navigateToDialogPath(fav.path)"
              >
                <span class="item-icon" v-html="fav.icon"></span>
                <span class="item-label">{{ fav.name }}</span>
              </div>
            </div>
          </div>

          <!-- 文件列表 -->
          <div class="dialog-content">
            <div v-if="dialogLoading" class="dialog-loading">
              <div class="loading-spinner"></div>
              <div>加载中...</div>
            </div>
            <div v-else-if="dialogError" class="dialog-error">
              ⚠️ {{ dialogError }}
            </div>
            <div v-else class="dialog-file-list">
              <div
                v-for="item in dialogItems"
                :key="item.id"
                class="dialog-file-item"
                :class="{ 
                  selected: selectedDialogItem?.id === item.id,
                  folder: item.isFolder 
                }"
                @click="selectDialogItem(item)"
                @dblclick="handleDialogItemDoubleClick(item)"
              >
                <span class="file-icon" v-html="item.icon"></span>
                <span class="file-name">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 对话框底部 -->
        <div class="dialog-footer">
          <div class="selected-path">
            <span class="label">选择:</span>
            <span class="path">{{ selectedDialogItem ? selectedDialogItem.name : '未选择' }}</span>
          </div>
          <div class="dialog-actions">
            <button class="cancel-btn" @click="closeFileDialog">取消</button>
            <button 
              class="open-btn" 
              :disabled="!selectedDialogItem"
              @click="confirmDialogSelection"
            >
              打开
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount, watch, nextTick, inject } from 'vue'
import * as monaco from 'monaco-editor'
import { useTheme } from '../../composables/useTheme'
import { FileAPI } from '../../api'

// 配置 Monaco Editor 的 Web Worker
// 这样可以避免 "Could not create web worker" 错误
self.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    const getWorkerModule = (moduleUrl: string, label: string) => {
      return new Worker(self.MonacoEnvironment!.getWorkerUrl!(moduleUrl, label), {
        name: label,
        type: 'module'
      })
    }

    switch (label) {
      case 'json':
        return getWorkerModule('/monaco-editor/esm/vs/language/json/json.worker?worker', label)
      case 'css':
      case 'scss':
      case 'less':
        return getWorkerModule('/monaco-editor/esm/vs/language/css/css.worker?worker', label)
      case 'html':
      case 'handlebars':
      case 'razor':
        return getWorkerModule('/monaco-editor/esm/vs/language/html/html.worker?worker', label)
      case 'typescript':
      case 'javascript':
        return getWorkerModule('/monaco-editor/esm/vs/language/typescript/ts.worker?worker', label)
      default:
        return getWorkerModule('/monaco-editor/esm/vs/editor/editor.worker?worker', label)
    }
  },
  getWorkerUrl(_moduleId: string, label: string) {
    switch (label) {
      case 'json':
        return new URL('monaco-editor/esm/vs/language/json/json.worker.js', import.meta.url).href
      case 'css':
      case 'scss':
      case 'less':
        return new URL('monaco-editor/esm/vs/language/css/css.worker.js', import.meta.url).href
      case 'html':
      case 'handlebars':
      case 'razor':
        return new URL('monaco-editor/esm/vs/language/html/html.worker.js', import.meta.url).href
      case 'typescript':
      case 'javascript':
        return new URL('monaco-editor/esm/vs/language/typescript/ts.worker.js', import.meta.url).href
      default:
        return new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url).href
    }
  }
}


interface FileItem {
  id: string
  name: string
  content: string
  language: string
  path?: string
  isFolder?: boolean
  loaded?: boolean
  originalContent?: string // Track original content for dirty check
  isNew?: boolean // Track if file is newly created and not saved
}

interface DialogFileItem {
  id: string
  name: string
  path: string
  isFolder: boolean
  icon: string
}

export default defineComponent({
  name: 'VSCodeApp',
  props: {
    window: {
      type: Object,
      default: () => ({})
    },
    // 从 Finder 传入的文件路径
    filePath: {
      type: String,
      default: ''
    },
    // 从 Finder 传入的文件名
    fileName: {
      type: String,
      default: ''
    },
    // 是否为新文件
    isNew: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const editorContainer = ref<HTMLElement | null>(null)
    let editor: monaco.editor.IStandaloneCodeEditor | null = null
    
    // 注入 openApp 函数
    const openApp = inject('openApp') as ((appId: string, props?: any) => void) | undefined
    
    // 使用应用主题系统
    const { currentTheme } = useTheme()
    
    const sidebarCollapsed = ref(false)
    const expandedFolders = ref(new Set(['root']))
    const activeFile = ref<FileItem | null>(null)
    const openTabs = ref<FileItem[]>([])
    const cursorPosition = ref({ line: 1, column: 1 })
    
    // 文件列表(初始为空,从外部加载)
    const files = ref<FileItem[]>([])
    
    // 文件选择对话框状态
    const showFileDialog = ref(false)
    const dialogCurrentPath = ref('macos_web/')
    const dialogHistory = ref<string[]>(['macos_web/'])
    const dialogHistoryIndex = ref(0)
    const dialogItems = ref<DialogFileItem[]>([])
    const selectedDialogItem = ref<DialogFileItem | null>(null)
    const dialogLoading = ref(false)
    const dialogError = ref('')
    const currentFolderPath = ref('macos_web/')

    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value
      // 延迟调整编辑器大小以适应新布局
      setTimeout(() => {
        editor?.layout()
      }, 300)
    }

    const toggleFolder = (folderId: string) => {
      if (expandedFolders.value.has(folderId)) {
        expandedFolders.value.delete(folderId)
      } else {
        expandedFolders.value.add(folderId)
      }
    }

    const getFileIcon = (filename: string): string => {
      const ext = filename.split('.').pop()?.toLowerCase()
      
      // VSCode Seti UI 风格 (Finder Style Blue Code Icon)
      const codeIcon = '<svg viewBox="0 0 32 32"><defs><linearGradient id="codeGradVS" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#55A3FF;stop-opacity:1"/><stop offset="100%" style="stop-color:#2E86DE;stop-opacity:1"/></linearGradient><filter id="codeShadowVS" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.3)"/></filter></defs><path d="M6 2 L20 2 L26 8 L26 30 L6 30 C4.9 30 4 29.1 4 28 L4 4 C4 2.9 4.9 2 6 2 Z" fill="url(#codeGradVS)" filter="url(#codeShadowVS)" stroke="rgba(0,0,0,0.2)" stroke-width="0.5"/><path d="M20 2 L20 8 L26 8 Z" fill="rgba(255,255,255,0.2)"/><path d="M10 14 L12 16 L10 18" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/><path d="M20 14 L18 16 L20 18" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/><line x1="14" y2="12" y1="20" x2="16" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/></svg>'

      const icons: Record<string, string> = {
        'html': codeIcon,
        'css': codeIcon,
        'js': codeIcon,
        'ts': codeIcon,
        'json': codeIcon,
        'vue': codeIcon,
        'py': codeIcon,
        'java': codeIcon,
        'md': codeIcon,
        'img': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="#9F74B3" d="M21.3 17.2c1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8-1.8.8-1.8 1.8.8 1.8 1.8 1.8zm-11.1-5.5v12.4h15.3V11.7H10.2zm.7.7h13.9v10.8l-3.6-4.1-2.2 2.6-4.4-4.7-3.7 4.6v-9.2zm9.8-4.5H6.5v10.8h1.9V9.6h12.3V7.9z"/></svg>'
      }
      
      const imgIcon = icons['img']
      const extStr = ext || ''
      // @ts-ignore
      if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(extStr)) return imgIcon
      
      return icons[ext || ''] || '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1000"><path d="M394.1 537.8h411.7v54.7H394.1v-54.7zm0-130.3H624v54.7H394.1v-54.7zm0-130.3h411.7v54.7H394.1v-54.7zm0 390.9H700v54.7H394.1v-54.7z"/></svg>'
    }

    const getFolderIcon = (isOpen: boolean): string => {
      if (isOpen) {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="#54aef5" d="M28.8 6.9H16.1V5.7c0-1.4-1.1-2.5-2.5-2.5H.6v25.6h30.6V9.4c.1-1.4-1-2.5-2.4-2.5z"/></svg>'
      }
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="#ABABAB" d="M28.8 6.9H16.1V5.7c0-1.4-1.1-2.5-2.5-2.5H.6v25.6h30.6V9.4c.1-1.4-1-2.5-2.4-2.5z"/></svg>'
    }

    const getLanguageMode = (filename: string): string => {
      const ext = filename.split('.').pop()?.toLowerCase()
      const langMap: Record<string, string> = {
        'html': 'HTML',
        'css': 'CSS',
        'js': 'JavaScript',
        'ts': 'TypeScript',
        'json': 'JSON',
        'md': 'Markdown',
        'vue': 'Vue',
        'py': 'Python',
        'java': 'Java',
        'png': 'Image',
        'jpg': 'Image',
        'jpeg': 'Image',
        'gif': 'Image',
        'webp': 'Image',
        'svg': 'Image'
      }
      return langMap[ext || ''] || 'Plain Text'
    }

    const isImage = (filename: string): boolean => {
      const ext = filename.split('.').pop()?.toLowerCase()
      return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext || '')
    }

    const getImageUrl = (file: FileItem): string => {
      if (file.path) {
        return FileAPI.getImageUrl(file.path)
      }
      return ''
    }

    // 确保文件内容已加载
    const ensureFileContent = async (file: FileItem) => {
      // 这里的逻辑需要区分图片和文本
      if (isImage(file.name)) {
        file.loaded = true
        file.content = '' // 图片不需要加载文本内容
        return
      }

      // 如果已经加载过，或者是新建的文件（有内容但可能没路径），直接返回
      if (file.loaded || (file.content && !file.path)) {
        file.loaded = true
        return
      }

      if (file.path) {
        try {
          if (editor && activeFile.value?.id === file.id) {
             // 如果编辑器正在显示此文件，显示加载中...
             editor.setValue('Loading...')
          }
          
          const content = await FileAPI.readTextFile(file.path!)
          file.content = content
          file.loaded = true
          
          // 如果当前编辑器还指向这个文件，更新显示
          if (editor && activeFile.value?.id === file.id) {
            editor.setValue(content)
            monaco.editor.setModelLanguage(editor.getModel()!, file.language)
          }
        } catch (e) {
          console.error('加载文件失败:', e)
          file.content = '// 加载文件失败\n// 请检查网络或权限'
          file.loaded = true // 标记为已尝试加载
          if (editor && activeFile.value?.id === file.id) {
            editor.setValue(file.content)
          }
        }
      }
    }

    const openFile = async (file: FileItem) => {
      // 1. 设置为活动文件
      activeFile.value = file
      
      // 2. 如果不在标签页中，添加
      const existingTab = openTabs.value.find(tab => tab.id === file.id)
      if (!existingTab) {
        openTabs.value.push(file)
      }

      // 3. 确保内容已加载
      await ensureFileContent(file)

      // 4. 如果是图片，不需要初始化/更新编辑器
      if (isImage(file.name)) {
        // 可能需要隐藏编辑器或做其他处理
        return
      }

      // 5. 初始化编辑器
      if (!editor) {
        initEditor()
      }

      // 6. 更新编辑器内容
      if (editor) {
        // 如果是从图片切换回来，需要重新布局
        nextTick(() => {
          editor?.layout()
        })

        const model = editor.getModel()
        if (model) {
          if (model.getValue() !== file.content) {
            editor.setValue(file.content || '')
          }
          monaco.editor.setModelLanguage(model, file.language)
        }
      }
    }

    const switchTab = (tab: FileItem) => {
      openFile(tab)
    }

    const closeTab = (tab: FileItem) => {
      const index = openTabs.value.findIndex(t => t.id === tab.id)
      if (index === -1) return

      openTabs.value.splice(index, 1)

      // 如果关闭的是当前活动标签
      if (activeFile.value?.id === tab.id) {
        if (openTabs.value.length > 0) {
          // 切换到相邻标签
          const newIndex = Math.min(index, openTabs.value.length - 1)
          const nextTab = openTabs.value[newIndex]
          if (nextTab) {
            switchTab(nextTab)
          }
        } else {
          // 没有打开的标签了
          activeFile.value = null
          if (editor) {
            editor.setValue('')
          }
        }
      }
    }

    const createNewFile = () => {
      // 确定新文件的路径
      // 默认路径为 "macos_web/桌面/"
      // 只有当 currentFolderPath 明确指向其他文件夹时（不包括根目录），才使用 currentFolderPath
      let basePath = currentFolderPath.value;
      
      if (!basePath || basePath === 'macos_web/' || basePath === 'macos_web') {
        basePath = 'macos_web/桌面/';
      }
      
      if (!basePath.endsWith('/')) {
        basePath += '/';
      }

      const defaultName = `untitled-${files.value.length + 1}.txt`;
      const userInput = prompt('请输入文件名', defaultName);
      
      if (userInput === null) return; // 用户取消
      
      const fileName = userInput.trim() || defaultName;
      const fullPath = `${basePath}${fileName}`;

      const newFile: FileItem = {
        id: Date.now().toString(),
        name: fileName,
        content: '',
        language: getLanguageFromFileName(fileName), // 根据用户输入的文件名自动推断语言
        loaded: true,
        path: fullPath, // 设置完整路径，以便保存时知道保存到哪里
        originalContent: '',
        isNew: true
      }
      files.value.push(newFile)
      openFile(newFile)
    }

    const workspaceName = computed(() => {
      const path = currentFolderPath.value
      if (!path || path === 'macos_web/') return 'WORKSPACE'
      
      const cleanPath = path.endsWith('/') ? path.slice(0, -1) : path
      const parts = cleanPath.split('/')
      const name = parts[parts.length - 1]
      
      return name ? name.toUpperCase() : 'WORKSPACE'
    })

    // 打开 Finder 应用


    const initEditor = () => {
      if (!editorContainer.value || editor) return

      // 使用应用主题而不是系统主题
      const isDark = currentTheme.value === 'dark'

      editor = monaco.editor.create(editorContainer.value, {
        value: activeFile.value?.content || '',
        language: activeFile.value?.language || 'plaintext',
        theme: isDark ? 'vs-dark' : 'vs',
        fontSize: 14,
        fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace",
        minimap: {
          enabled: true
        },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        insertSpaces: true,
        wordWrap: 'on',
        lineNumbers: 'on',
        renderWhitespace: 'selection',
        bracketPairColorization: {
          enabled: true
        }
      })

      // 监听光标位置变化
      editor.onDidChangeCursorPosition((e) => {
        cursorPosition.value = {
          line: e.position.lineNumber,
          column: e.position.column
        }
      })

      // 监听内容变化
      editor.onDidChangeModelContent(() => {
        if (activeFile.value) {
          activeFile.value.content = editor!.getValue()
        }
      })
    }

    const handleResize = () => {
      editor?.layout()
    }

    // 加载外部文件
    const loadExternalFile = async (filePath: string, fileName: string, isNewFile: boolean = false) => {
      try {
        // 检查是否已存在
        const existingFile = files.value.find(f => f.path === filePath || f.name === fileName)
        if (existingFile && !isNewFile) {
          openFile(existingFile)
          return
        }

        const isImg = isImage(fileName)
        let content = ''
        
        // 如果不是图片，尝试读取内容
        if (!isImg && !isNewFile) {
           try {
             content = await FileAPI.readTextFile(filePath)
           } catch (e) {
             console.error('读取文件内容失败', e)
             content = '// 读取失败'
           }
        }
        
        // 获取文件语言类型
        const language = getLanguageFromFileName(fileName)
        
        // 创建文件对象
        const externalFile: FileItem = {
          id: filePath || 'external-' + Date.now(),
          name: fileName,
          content: content,
          language: language,
          path: filePath,
          loaded: true,
          originalContent: content, // Initialize original content
          isNew: isNewFile
        }
        
        files.value.unshift(externalFile)
        openFile(externalFile)
      } catch (error) {
        console.error('加载文件失败:', error)
        const errorFile: FileItem = {
          id: 'error-' + Date.now(),
          name: fileName,
          content: `// 加载文件失败\n// 文件路径: ${filePath}\n// 错误信息: ${error}`,
          language: 'plaintext',
          path: filePath,
          loaded: true
        }
        openFile(errorFile)
      }
    }

    // 根据文件名获取语言类型
    const getLanguageFromFileName = (fileName: string): string => {
      const ext = fileName.split('.').pop()?.toLowerCase()
      const langMap: Record<string, string> = {
        'html': 'html',
        'css': 'css',
        'scss': 'scss',
        'less': 'less',
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'json': 'json',
        'md': 'markdown',
        'markdown': 'markdown',
        'vue': 'html',
        'py': 'python',
        'java': 'java',
        'c': 'c',
        'cpp': 'cpp',
        'h': 'c',
        'hpp': 'cpp',
        'cs': 'csharp',
        'go': 'go',
        'rs': 'rust',
        'php': 'php',
        'rb': 'ruby',
        'swift': 'swift',
        'kt': 'kotlin',
        'sh': 'shell',
        'bash': 'shell',
        'yaml': 'yaml',
        'yml': 'yaml',
        'xml': 'xml',
        'sql': 'sql',
        'txt': 'plaintext',
        'log': 'plaintext'
      }
      return langMap[ext || ''] || 'plaintext'
    }

    const saveCurrentFile = async () => {
      if (!activeFile.value || !editor) return
      
      // Update content from editor just in case
      activeFile.value.content = editor.getValue()
      
      if (!activeFile.value.path) {
        // Handle "Save As" logic if needed, or prompt
        // For now, only handle files with paths (opened from Finder or created via New File flow)
        return
      }
      
      try {
        await FileAPI.createFile(activeFile.value.path, activeFile.value.content)
        console.log('文件已保存:', activeFile.value.path)
        
        // 更新 originalContent 和 isNew 状态
        activeFile.value.originalContent = activeFile.value.content
        activeFile.value.isNew = false
        
        // 可选: 显示保存成功的提示
        // alert('已保存')
      } catch (error: any) {
        console.error('保存失败:', error)
        alert('保存失败: ' + (error.message || '未知错误'))
      }
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        saveCurrentFile()
      }
    }

    onMounted(async () => {
      await nextTick()
      
      // 如果从 Finder 传入了文件路径,加载该文件
      if (props.filePath && props.fileName) {
        await loadExternalFile(props.filePath, props.fileName, props.isNew)
      }

      window.addEventListener('resize', handleResize)
      
      // 添加 Ctrl+S 保存监听
      window.addEventListener('keydown', handleKeydown)
    })

    onBeforeUnmount(() => {
      editor?.dispose()
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeydown)
    })

    // 监听窗口大小变化
    watch(() => props.window, () => {
      setTimeout(() => {
        editor?.layout()
      }, 100)
    }, { deep: true })

    // 监听应用主题变化
    watch(currentTheme, (newTheme) => {
      if (editor) {
        monaco.editor.setTheme(newTheme === 'dark' ? 'vs-dark' : 'vs')
      }
    })

    // ========== 文件选择对话框功能 ==========
    
    // 对话框快捷访问列表
    const dialogFavorites = ref([
      {
        id: 'root',
        name: '根目录',
        path: 'macos_web/',
        icon: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M14.5 3H7.71l-.85-.85L6.51 2h-5l-.5.5v11l.5.5h13l.5-.5v-10L14.5 3zm-.51 10.49V13h-12V7h4.49l.35-.15.86-.86H14v1.5l-.01 5.99z"/></svg>'
      }
    ])

    // 对话框面包屑导航
    const dialogBreadcrumbs = computed(() => {
      if (dialogCurrentPath.value === 'macos_web/') return ['根目录']
      const parts = dialogCurrentPath.value.split('/').filter(Boolean)
      return ['根目录', ...parts]
    })

    // 对话框导航控制
    const canGoBackDialog = computed(() => dialogHistoryIndex.value > 0)
    const canGoForwardDialog = computed(() => dialogHistoryIndex.value < dialogHistory.value.length - 1)

    const goBackDialog = () => {
      if (canGoBackDialog.value) {
        dialogHistoryIndex.value--
        const path = dialogHistory.value[dialogHistoryIndex.value]
        if (path) {
          dialogCurrentPath.value = path
          loadDialogPath(path)
        }
      }
    }

    const goForwardDialog = () => {
      if (canGoForwardDialog.value) {
        dialogHistoryIndex.value++
        const path = dialogHistory.value[dialogHistoryIndex.value]
        if (path) {
          dialogCurrentPath.value = path
          loadDialogPath(path)
        }
      }
    }

    const navigateToDialogPath = (path: string) => {
      // 添加到历史记录
      dialogHistory.value = dialogHistory.value.slice(0, dialogHistoryIndex.value + 1)
      dialogHistory.value.push(path)
      dialogHistoryIndex.value = dialogHistory.value.length - 1
      
      dialogCurrentPath.value = path
      loadDialogPath(path)
    }

    const navigateToDialogCrumb = (index: number) => {
      if (index === 0) {
        navigateToDialogPath('macos_web/')
      } else {
        const parts = dialogCurrentPath.value.split('/').filter(Boolean)
        // 重新构建路径，保留 'macos_web' 作为前缀
        const newPath = parts.slice(0, index).join('/') + '/'
        navigateToDialogPath(newPath)
      }
    }

    // 加载对话框路径内容
    const loadDialogPath = async (path: string) => {
      dialogLoading.value = true
      dialogError.value = ''
      selectedDialogItem.value = null

      try {
        const response = await FileAPI.getData(path)
        const items: DialogFileItem[] = []

        // 添加文件夹
        if (response.CommonPrefixes) {
          for (const folder of response.CommonPrefixes) {
            const folderName = folder.Prefix.replace(path, '').replace(/\/$/, '')
            if (folderName) {
              items.push({
                id: folder.Prefix,
                name: folderName,
                path: folder.Prefix,
                isFolder: true,
                icon: getFolderIcon(false)
              })
            }
          }
        }

        // 添加文件
        if (response.Contents) {
          for (const file of response.Contents) {
            const fileName = file.Key.replace(path, '')
            if (fileName && !fileName.endsWith('/') && fileName !== '_#') {
              items.push({
                id: file.Key,
                name: fileName,
                path: file.Key,
                isFolder: false,
                icon: getFileIcon(fileName)
              })
            }
          }
        }

        dialogItems.value = items
      } catch (error: any) {
        console.error('加载文件夹失败:', error)
        dialogError.value = error.message || '加载失败'
      } finally {
        dialogLoading.value = false
      }
    }

    // 选择对话框项目
    const selectDialogItem = (item: DialogFileItem) => {
      selectedDialogItem.value = item
    }

    // 双击对话框项目
    const handleDialogItemDoubleClick = (item: DialogFileItem) => {
      if (item.isFolder) {
        // 如果是文件夹，进入该文件夹
        navigateToDialogPath(item.path)
      } else {
        // 如果是文件，直接打开
        confirmDialogSelection()
      }
    }

    // 打开文件选择对话框
    const openFileDialog = () => {
      showFileDialog.value = true
      dialogCurrentPath.value = currentFolderPath.value || 'macos_web/'
      dialogHistory.value = [dialogCurrentPath.value]
      dialogHistoryIndex.value = 0
      loadDialogPath(dialogCurrentPath.value)
    }

    // 关闭文件选择对话框
    const closeFileDialog = () => {
      showFileDialog.value = false
      selectedDialogItem.value = null
      dialogItems.value = []
    }

    // 确认选择
    const confirmDialogSelection = async () => {
      if (!selectedDialogItem.value) return

      const item = selectedDialogItem.value

      if (item.isFolder) {
        // 选择了文件夹，加载该文件夹下的所有文件
        await loadFolderContents(item.path)
        currentFolderPath.value = item.path
      } else {
        // 选择了文件，直接打开
        await loadExternalFile(item.path, item.name)
      }

      closeFileDialog()
    }

    // 加载文件夹内容到文件树
    const loadFolderContents = async (folderPath: string) => {
      try {
        const response = await FileAPI.getData(folderPath)
        const loadedFiles: FileItem[] = []

        // 只加载文件，不加载子文件夹
        if (response.Contents) {
          for (const file of response.Contents) {
            const fileName = file.Key.replace(folderPath, '').replace(/^\//, '')
            if (fileName && !fileName.endsWith('/') && !fileName.includes('/') && fileName !== '_#') {
              // 只加载直接子文件，不加载子文件夹中的文件
              loadedFiles.push({
                id: file.Key,
                name: fileName,
                path: file.Key,
                content: '', // 内容将在打开时加载
                language: getLanguageFromFileName(fileName),
                isFolder: false
              })
            }
          }
        }

        files.value = loadedFiles
        
        // 如果有文件，自动打开第一个
        // 如果有文件，自动打开第一个
        const firstFile = loadedFiles[0]
        if (firstFile && firstFile.path) {
          await loadExternalFile(firstFile.path, firstFile.name)
        }
      } catch (error) {
        console.error('加载文件夹内容失败:', error)
      }
    }

    // 修改原来的openFinder函数，改为打开文件选择对话框
    const openFinderDialog = () => {
      openFileDialog()
    }

    // 关闭当前工作区
    const closeWorkspace = () => {
      currentFolderPath.value = 'macos_web/'
      files.value = [] // 清空文件列表
      openTabs.value = [] // 关闭所有标签页
      activeFile.value = null // 清除当前活动文件
    }

    // Check if current file has unsaved changes
    const hasUnsavedChanges = computed(() => {
      if (!activeFile.value) return false
      
      // If it's a new file (never saved to disk), explicitly marked
      if (activeFile.value.isNew) return true
      
      // If content differs from original
      // Use logical OR with empty string to handle undefined/null safely
      const current = activeFile.value.content || ''
      const original = activeFile.value.originalContent || ''
      
      return current !== original
    })

    const runHtmlInNewTab = () => {
      if (!activeFile.value || !activeFile.value.path) return
      
      const baseUrl = 'https://static-host-48uh3xwo-macweb.sealoshzh.site/'
      const filePath = activeFile.value.path.startsWith('/') 
        ? activeFile.value.path.slice(1) 
        : activeFile.value.path
      
      const url = `${baseUrl}${filePath}`
      window.open(url, '_blank')
    }

    const runHtmlInSafari = () => {
      if (!activeFile.value || !activeFile.value.path) return
      
      const baseUrl = 'https://static-host-48uh3xwo-macweb.sealoshzh.site/'
      const filePath = activeFile.value.path.startsWith('/') 
        ? activeFile.value.path.slice(1) 
        : activeFile.value.path
      
      const url = `${baseUrl}${filePath}`
      if (openApp) {
        openApp('safari', { url })
      }
    }

    const editorActions = computed(() => {
      const actions = []
      
      // Run buttons for HTML
      if (activeFile.value && getLanguageFromFileName(activeFile.value.name) === 'html') {
        // Run in Safari (Internal)
        actions.push({
          id: 'run-safari',
          title: '在 Safari 中运行',
          handler: runHtmlInSafari,
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm1.17-9.42l-1.08 4.67-4.67 1.08 1.08-4.67 4.67-1.08z"/>
          </svg>`
        })

        // Run in New Tab (External)
        actions.push({
          id: 'run-browser',
          title: '在新标签页中运行',
          handler: runHtmlInNewTab,
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2.5 13.5v-11h5v1h-4v9h9v-4h1v5h-11zm5-8h2.3l-5.3 5.3.7.7 5.3-5.3v2.3h1v-4h-4v1z"/>
          </svg>`
        })
      }

      // Save button
      if (hasUnsavedChanges.value) {
        actions.push({
          id: 'save',
          title: '保存 (Ctrl+S)',
          handler: saveCurrentFile,
          icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11 1h-8c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h10c.55 0 1-.45 1-1v-9l-3-4zm-8 2h7v3h-7v-3zm7 11h-7v-3h7v3zm1-1c0 .55-.45 1-1 1s-1-.45-1-1v-4h-6v4c0 .55-.45 1-1 1s-1-.45-1-1v-8h-2v11h11v-5l-1-2z"/>
            <path d="M4 8h6v1h-6z" />
          </svg>`
        })
      }
      
      return actions
    })

    return {
      editorContainer,
      sidebarCollapsed,
      expandedFolders,
      activeFile,
      openTabs,
      files,
      cursorPosition,
      workspaceName, // Export workspaceName
      currentFolderPath, // Export currentFolderPath for template check
      editorActions, // Export editorActions
      hasUnsavedChanges, // Export state
      toggleSidebar,
      toggleFolder,
      getFileIcon,
      getFolderIcon,
      getLanguageMode,
      openFile,
      saveCurrentFile,
      switchTab,
      closeTab,
      createNewFile,
      closeWorkspace, // Export closeWorkspace
      openFinder: openFinderDialog,
      // 对话框相关
      showFileDialog,
      dialogCurrentPath,
      dialogFavorites,
      dialogBreadcrumbs,
      dialogItems,
      selectedDialogItem,
      dialogLoading,
      dialogError,
      canGoBackDialog,
      canGoForwardDialog,
      goBackDialog,
      goForwardDialog,
      navigateToDialogPath,
      navigateToDialogCrumb,
      selectDialogItem,
      handleDialogItemDoubleClick,
      closeFileDialog,
      confirmDialogSelection,
      isImage,
      getImageUrl
    }
  }
})
</script>

<style scoped>
.vscode-app {
  display: flex;
  height: 100%;
  background: var(--window-bg);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

/* Activity Bar */
.activity-bar {
  width: 48px;
  background: var(--activity-bar-bg, #333333);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  z-index: 2;
  border-right: 1px solid var(--border-color, #2b2b2b); /* Added border to match VSCode */
}

.activity-top, .activity-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.activity-item {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.4;
  transition: opacity 0.1s; /* Faster transition */
  color: var(--activity-bar-fg, #ffffff);
  position: relative;
}

.activity-item:hover {
  opacity: 1;
}

.activity-item.active {
  opacity: 1;
}

.activity-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--activity-bar-active-border, #ffffff);
}

/* 侧边栏 (Sidebar / Explorer) */
.sidebar {
  width: 250px;
  background: var(--sidebar-bg, #252526);
  border-right: 1px solid var(--border-color, #2b2b2b); /* Corrected active border */
  display: flex;
  flex-direction: column;
  transition: width 0.1s ease;
  user-select: none;
  font-size: 13px;
  color: var(--text-secondary, #cccccc);
}

.sidebar.collapsed {
  width: 0;
  overflow: hidden;
  border: none;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 35px;
  padding: 0 10px 0 20px;
  font-size: 11px;
  letter-spacing: 0.5px; /* Tweak letter spacing */
  text-transform: uppercase;
  color: var(--text-secondary);
  font-weight: normal;
}

.sidebar-title {
  margin-right: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px; /* Ensure small font size */
}

.sidebar-actions {
  display: flex;
  gap: 4px;
}

.action-btn, .collapse-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 3px;
  border-radius: 4px;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover, .collapse-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.1); /* Visible hover state */
}

.file-tree {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* Section Header (like WORKSPACE) */
.section-header {
  display: flex;
  align-items: center;
  padding: 4px 0;
  cursor: pointer;
  font-weight: 700;
  color: var(--text-primary);
  background: transparent; /* Typically transparant in VSCode unless hovered/focused */
}

.section-actions {
  margin-left: auto;
  padding-right: 8px;
  display: none; /* 默认隐藏 */
}

.section-header:hover .section-actions {
  display: flex; /* 悬停时显示 */
}

.section-action-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-action-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.1);
}
.section-header:hover {
  background: rgba(255, 255, 255, 0.04); /* Very subtle hover */
}

.section-arrow {
  width: 22px; /* Slightly wider */
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s;
  opacity: 1; /* Arrow is usually fully opaque/white-ish */
  color: var(--text-secondary);
}

.section-arrow.expanded {
  transform: rotate(90deg);
}

.section-name {
  font-size: 11px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Tree Children */
.tree-children {
  padding-bottom: 0; /* VS Code tightly packs items */
}

/* Tree Item (File) */
.tree-item {
  display: flex;
  align-items: center;
  padding: 3px 12px;
  cursor: pointer;
  color: var(--text-primary); /* Default file color is usually brighter */
  border: 1px solid transparent; 
  margin-left: 0; 
  padding-left: 20px; 
}

.tree-item:hover {
  background: var(--hover-bg, #2a2d2e);
}

.tree-item.active {
  background: var(--active-bg, #37373d);
  color: #ffffff;
}

.tree-item .icon {
  margin-right: 6px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tree-item .name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 22px;
  font-size: 13px; /* Ensure 13px */
}

/* Main Area adjustments to fit with flex container */
.main-area {
  background: var(--editor-bg, #1e1e1e);
}

/* 主编辑区域 */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 标签栏容器 */
.tabs-bar-container {
  display: flex;
  background: var(--tabs-bg, #f8f8f8);
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  width: 100%;
}

.tabs-bar {
  flex: 1;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  background: transparent;
  border-bottom: none;
}

.tabs-bar::-webkit-scrollbar {
  height: 0;
}

.editor-actions {
  display: flex;
  align-items: center;
  padding: 0 8px;
  border-left: 1px solid var(--border-color, #e0e0e0);
}

.editor-action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  color: var(--text-secondary);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor-action-btn:hover {
  color: var(--text-primary);
  background: var(--hover-bg, rgba(0,0,0,0.05));
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 12px;
  background: var(--status-bar-bg, #007acc);
  color: white;
  font-size: 12px;
  border-top: 1px solid var(--border-color, #0066a8);
}

.tab {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-right: 1px solid var(--border-color, #e0e0e0);
  cursor: pointer;
  background: var(--tab-bg, #ececec);
  transition: background 0.2s;
  min-width: 120px;
  max-width: 200px;
}

.tab:hover {
  background: var(--tab-hover-bg, #e0e0e0);
}

.tab.active {
  background: var(--window-bg, #ffffff);
}

.tab-icon {
  margin-right: 6px;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tab-icon svg {
  width: 100%;
  height: 100%;
}

.tab-name {
  flex: 1;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 4px;
  margin-left: 8px;
  font-size: 18px;
  color: var(--text-secondary);
  opacity: 0;
  transition: opacity 0.2s;
}

.tab:hover .close-btn {
  opacity: 1;
}

.close-btn:hover {
  color: var(--text-primary);
}

.editor-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.monaco-host {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.image-preview {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--window-bg);
  overflow: hidden;
  padding: 0;
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  box-shadow: none;
}

[data-theme="dark"] .image-preview {
  background: #1e1e1e;
}

.welcome-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: var(--window-bg);
}

.welcome-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.vscode-logo {
  width: 120px;
  height: 120px;
  opacity: 0.4;
}

.welcome-text {
  font-size: 14px;
  font-weight: 400;
  color: var(--text-secondary, #6c6c6c);
  margin: 0;
  opacity: 0.5;
}

.open-folder-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #007ACC;
  color: white;
  border: none;
  border-radius: 2px;
  font-size: 13px;
  font-weight: 400;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 8px;
}

.open-folder-btn:hover {
  background: #005A9E;
}

.open-folder-btn svg {
  flex-shrink: 0;
}

/* 状态栏 */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 12px;
  background: var(--status-bar-bg, #007acc);
  color: white;
  font-size: 12px;
  border-top: 1px solid var(--border-color, #0066a8);
}

.status-left,
.status-right {
  display: flex;
  gap: 16px;
}

/* Light Theme Overrides */
/* Default is Dark, so we define light theme override variables or scope */
/* Assuming root variables are set, but let's be specific for VSCodeApp */

.vscode-app {
  /* Default Dark Theme Variables (Standard VSCode Dark) */
  --activity-bar-bg: #333333;
  --activity-bar-fg: #ffffff;
  --activity-bar-active-border: #ffffff;
  --sidebar-bg: #252526;
  --editor-bg: #1e1e1e;
  --border-color: #2b2b2b;
  --text-primary: #cccccc;
  --text-secondary: #969696;
  --hover-bg: #2a2d2e;
  --active-bg: #37373d;
  --tabs-bg: #252526;
  --tab-active-bg: #1e1e1e;
  --status-bar-bg: #007acc;
  --status-bar-fg: #ffffff;
}

/* Dark Theme Specifics (Explicit) */
[data-theme="dark"] .vscode-app {
  --activity-bar-bg: #333333;
  --sidebar-bg: #252526;
  --editor-bg: #1e1e1e;
  --text-primary: #cccccc;
  --border-color: #2b2b2b;
}

/* Light Theme Specifics */
/* VSCode Default Light */
[data-theme="light"] .vscode-app {
  --activity-bar-bg: #f3f3f3;
  --activity-bar-fg: #424242;
  --activity-bar-active-border: #007acc;
  --sidebar-bg: #f3f3f3;
  --editor-bg: #ffffff;
  --border-color: #e4e4e4;
  --text-primary: #333333;
  --text-secondary: #616161;
  --hover-bg: #e8e8e8;
  --active-bg: #dbeafc; /* Light blueish selection */
  --tabs-bg: #ececec;
  --tab-active-bg: #ffffff;
  --status-bar-bg: #007acc;
}

/* Adjustments for light theme sidebar text */
[data-theme="light"] .sidebar-header,
[data-theme="light"] .sidebar {
  color: #333333;
}

[data-theme="light"] .section-header {
  background: rgba(0,0,0,0.03);
}

[data-theme="light"] .tree-item {
  color: #333333;
}

[data-theme="light"] .tree-item:hover {
  background: #e4e6f1;
}

[data-theme="light"] .tree-item.active {
  background: #e4e6f1;
  color: #333333;
  border-color: #e4e6f1;
}

/* Remove old dark theme block overrides that clash */
/* [data-theme="dark"] .vscode-app .sidebar { ... } - REMOVED/REPLACED above */

[data-theme="dark"] .vscode-app .tabs-bar {
  background: #2d2d2d;
  border-bottom-color: var(--app-border);
}

[data-theme="dark"] .vscode-app .tab {
  background: #2d2d2d;
  border-right-color: var(--app-border);
}

[data-theme="dark"] .vscode-app .tab:hover {
  background: #3e3e42;
}

[data-theme="dark"] .vscode-app .tab.active {
  background: var(--app-bg);
}

[data-theme="dark"] .vscode-app .close-btn {
  color: var(--text-secondary);
}

[data-theme="dark"] .vscode-app .close-btn:hover {
  color: var(--text-primary);
}

[data-theme="dark"] .vscode-app .welcome-screen {
  background: var(--app-bg);
}

[data-theme="dark"] .vscode-app .welcome-content p {
  color: var(--text-secondary);
}

[data-theme="dark"] .vscode-app .status-bar {
  background: #007acc;
  border-top-color: #0066a8;
}

/* 文件选择对话框样式 */
.file-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

.file-dialog {
  width: 700px;
  max-width: 90vw;
  height: 500px;
  max-height: 80vh;
  background: var(--window-bg, #ffffff);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  background: var(--window-bg, #ffffff);
}

.dialog-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.dialog-close {
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  font-size: 20px;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-close:hover {
  background: var(--hover-bg, rgba(0, 0, 0, 0.05));
  color: var(--text-primary);
}

.dialog-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  background: var(--tabs-bg, #f8f8f8);
}

.dialog-toolbar .nav-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: var(--window-bg, #ffffff);
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  color: var(--text-primary);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-toolbar .nav-btn:hover:not(:disabled) {
  background: var(--hover-bg, rgba(0, 0, 0, 0.05));
}

.dialog-toolbar .nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.dialog-path {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-primary);
  overflow-x: auto;
  white-space: nowrap;
}

.dialog-path .path-item {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.dialog-path .path-item:hover {
  background: var(--hover-bg, rgba(0, 0, 0, 0.05));
}

.dialog-path .path-separator {
  margin: 0 4px;
  opacity: 0.5;
  font-size: 10px;
}

.dialog-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.dialog-sidebar {
  width: 180px;
  background: var(--sidebar-bg, #f3f3f3);
  border-right: 1px solid var(--border-color, #e0e0e0);
  overflow-y: auto;
  padding: 12px 0;
}

.dialog-sidebar .sidebar-section {
  margin-bottom: 16px;
}

.dialog-sidebar .section-title {
  padding: 8px 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
}

.dialog-sidebar .sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-primary);
  transition: background 0.2s;
}

.dialog-sidebar .sidebar-item:hover {
  background: var(--hover-bg, rgba(0, 0, 0, 0.05));
}

.dialog-sidebar .sidebar-item.active {
  background: var(--active-bg, rgba(0, 122, 255, 0.1));
  color: var(--primary-color, #007aff);
}

.dialog-sidebar .item-icon {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.dialog-sidebar .item-icon svg {
  width: 100%;
  height: 100%;
}

.dialog-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: var(--window-bg, #ffffff);
}

.dialog-loading,
.dialog-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
  color: var(--text-secondary);
}

.dialog-error {
  color: #ff3b30;
}

.dialog-file-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dialog-file-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.dialog-file-item:hover {
  background: var(--hover-bg, rgba(0, 0, 0, 0.05));
}

.dialog-file-item.selected {
  background: var(--active-bg, rgba(0, 122, 255, 0.1));
  color: var(--primary-color, #007aff);
}

.dialog-file-item.folder {
  font-weight: 500;
}

.dialog-file-item .file-icon {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dialog-file-item .file-icon svg {
  width: 100%;
  height: 100%;
}

.dialog-file-item .file-name {
  flex: 1;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color, #e0e0e0);
  background: var(--window-bg, #ffffff);
}

.selected-path {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}

.selected-path .label {
  font-weight: 500;
}

.selected-path .path {
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dialog-actions {
  display: flex;
  gap: 12px;
}

.cancel-btn,
.open-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: var(--hover-bg, rgba(0, 0, 0, 0.05));
  color: var(--text-primary);
}

.cancel-btn:hover {
  background: var(--hover-bg, rgba(0, 0, 0, 0.1));
}

.open-btn {
  background: #007aff;
  color: white;
}

.open-btn:hover:not(:disabled) {
  background: #0051d5;
}

.open-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 深色主题适配 */
[data-theme="dark"] .file-dialog {
  background: var(--app-bg);
}

[data-theme="dark"] .dialog-header,
[data-theme="dark"] .dialog-footer {
  background: var(--app-bg);
  border-color: var(--app-border);
}

[data-theme="dark"] .dialog-toolbar {
  background: #2d2d2d;
  border-color: var(--app-border);
}

[data-theme="dark"] .dialog-toolbar .nav-btn {
  background: var(--app-bg);
}

[data-theme="dark"] .dialog-sidebar {
  background: var(--app-sidebar-bg);
  border-color: var(--app-border);
}

[data-theme="dark"] .dialog-content {
  background: var(--app-bg);
}

[data-theme="dark"] .dialog-file-item:hover {
  background: var(--app-item-hover);
}

[data-theme="dark"] .dialog-file-item.selected {
  background: rgba(14, 99, 156, 0.3);
  color: var(--macos-blue);
}

[data-theme="dark"] .cancel-btn {
  background: #3a3a3c;
  color: var(--text-primary);
}

[data-theme="dark"] .cancel-btn:hover {
  background: #48484a;
}
</style>
