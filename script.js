// Set current year in footer
document.addEventListener('DOMContentLoaded', function() {
    const currentYearElements = document.querySelectorAll('#current-year');
    const currentYear = new Date().getFullYear();
    
    currentYearElements.forEach(element => {
      element.textContent = currentYear;
    });
  
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
    
    themeToggle.addEventListener('click', function() {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
      mobileMenuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('show');
        mobileMenuToggle.classList.toggle('active');
      });
    }
  
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab-button').forEach(btn => {
          btn.classList.remove('active');
        });
        
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });
        
        // Add active class to clicked tab and corresponding content
        this.classList.add('active');
        document.getElementById(tabId)?.classList.add('active');
      });
    });
  
    // Write page functionality
    const previewButton = document.getElementById('preview-button');
    const contentTextarea = document.getElementById('content');
    const contentPreview = document.getElementById('content-preview');
    const previewPlaceholder = document.querySelector('.preview-placeholder');
    
    if (previewButton && contentTextarea && contentPreview) {
      previewButton.addEventListener('click', function() {
        const content = contentTextarea.value.trim();
        
        if (content) {
          contentPreview.innerHTML = content;
          previewPlaceholder?.remove();
          
          // Switch to preview tab
          document.querySelector('[data-tab="preview-tab"]')?.click();
        }
      });
    }
  
    // Publish button functionality
    const publishButton = document.getElementById('publish-button');
    
    if (publishButton) {
      publishButton.addEventListener('click', function() {
        const title = document.getElementById('title')?.value;
        const category = document.getElementById('category')?.value;
        const content = document.getElementById('content')?.value;
        
        if (!title || !category || !content) {
          alert('Please fill in all required fields: Title, Category, and Content.');
          return;
        }
        
        alert('Article published successfully!');
        
        // In a real app, you would submit the form data to a server
        // For demo purposes, we'll just reset the form
        document.getElementById('article-form')?.reset();
        if (contentPreview) {
          contentPreview.innerHTML = '';
          if (!previewPlaceholder) {
            const placeholder = document.createElement('div');
            placeholder.className = 'preview-placeholder';
            placeholder.innerHTML = `
              <p>Nothing to preview yet.</p>
              <p>Write some content and click the Preview button.</p>
            `;
            contentPreview.appendChild(placeholder);
          }
        }
        
        // Switch back to write tab
        document.querySelector('[data-tab="write-tab"]')?.click();
      });
    }
  
    // Copy link button functionality
    const copyLinkButton = document.querySelector('.copy-link-button');
    
    if (copyLinkButton) {
      copyLinkButton.addEventListener('click', function() {
        const currentUrl = window.location.href;
        
        // Create a temporary input element
        const tempInput = document.createElement('input');
        tempInput.value = currentUrl;
        document.body.appendChild(tempInput);
        
        // Select and copy the URL
        tempInput.select();
        document.execCommand('copy');
        
        // Remove the temporary input
        document.body.removeChild(tempInput);
        
        // Show feedback
        const originalText = this.textContent;
        this.textContent = 'Link Copied!';
        
        setTimeout(() => {
          this.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
            </svg>
            Copy Link
          `;
        }, 2000);
      });
    }

    document.getElementById("upload-btn").addEventListener("click", function () {
      document.getElementById("featured-image").click();
  });
  
  document.getElementById("featured-image").addEventListener("change", function (event) {
      const file = event.target.files[0];
  
      if (file) {
          if (file.size > 2 * 1024 * 1024) { // 2MB max size
              alert("File size should be under 2MB.");
              return;
          }
  
          const reader = new FileReader();
          reader.onload = function (e) {
              const imgPreview = document.getElementById("preview-img");
              imgPreview.src = e.target.result;
              imgPreview.style.display = "block";
          };
          reader.readAsDataURL(file);
      }
    });

    document.getElementById("featured-image").addEventListener("change", function (event) {
      const file = event.target.files[0];
  
      if (file) {
          if (file.size > 2 * 1024 * 1024) { // 2MB limit
              alert("File size should be under 2MB.");
              return;
          }
  
          const formData = new FormData();
          formData.append("featuredImage", file);
  
          fetch("http://localhost:5000/upload", {
              method: "POST",
              body: formData
          })
          .then(response => response.json())
          .then(data => {
              if (data.filePath) {
                  document.getElementById("preview-img").src = data.filePath;
                  document.getElementById("preview-img").style.display = "block";
                  alert("Image uploaded successfully!");
              }
          })
          .catch(err => console.error("Upload error:", err));
      }
  });

// Set current year in footer
document.addEventListener('DOMContentLoaded', function() {
  const currentYearElements = document.querySelectorAll('#current-year');
  const currentYear = new Date().getFullYear();
  
  currentYearElements.forEach(element => {
    element.textContent = currentYear;
  });

  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
  
  themeToggle.addEventListener('click', function() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', function() {
      mainNav.classList.toggle('show');
      mobileMenuToggle.classList.toggle('active');
    });
  }

  // Tab functionality
  const tabButtons = document.querySelectorAll('.tab-button');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Find the parent tabs container
      const tabsContainer = this.closest('.content-tabs') || document;
      
      // Remove active class from all tabs and content within this container
      tabsContainer.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
      });
      
      tabsContainer.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Add active class to corresponding content
      const tabContent = tabsContainer.querySelector(`#${tabId}`);
      if (tabContent) {
        tabContent.classList.add('active');
      }
    });
  });

  // Image upload functionality
  const uploadImageBtn = document.getElementById('upload-image-btn');
  const featuredImageInput = document.getElementById('featured-image-input');
  const imagePreviewContainer = document.getElementById('image-preview-container');
  const imagePreview = document.getElementById('image-preview');
  const removeImageBtn = document.querySelector('.remove-image-btn');
  
  if (uploadImageBtn && featuredImageInput) {
    uploadImageBtn.addEventListener('click', function() {
      featuredImageInput.click();
    });
    
    featuredImageInput.addEventListener('change', function(e) {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          imagePreview.src = e.target.result;
          imagePreviewContainer.style.display = 'block';
        };
        
        reader.readAsDataURL(e.target.files[0]);
      }
    });
    
    if (removeImageBtn) {
      removeImageBtn.addEventListener('click', function() {
        imagePreview.src = '';
        imagePreviewContainer.style.display = 'none';
        featuredImageInput.value = '';
      });
    }
  }

  // Write page functionality
  const previewButton = document.getElementById('preview-button');
  const titleInput = document.getElementById('title');
  const categorySelect = document.getElementById('category');
  const excerptTextarea = document.getElementById('excerpt');
  const contentTextarea = document.getElementById('content');
  const contentPreview = document.getElementById('content-preview');
  
  if (previewButton && contentTextarea && contentPreview) {
    previewButton.addEventListener('click', function() {
      const title = titleInput.value.trim();
      const category = categorySelect.options[categorySelect.selectedIndex]?.text || '';
      const excerpt = excerptTextarea.value.trim();
      const content = contentTextarea.value.trim();
      const imageSrc = imagePreview.src;
      
      // Create a comprehensive preview
      let previewHTML = '';
      
      if (title || category || imageSrc || content) {
        // Add article header
        previewHTML += '<div class="article-preview-header">';
        
        if (title) {
          previewHTML += `<h1>${title}</h1>`;
        } else {
          previewHTML += '<h1>Untitled Article</h1>';
        }
        
        previewHTML += '<div class="article-preview-meta">';
        
        if (category) {
          previewHTML += `<span class="article-preview-category">${category}</span>`;
        }
        
        // Add current date
        const currentDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        previewHTML += `<span class="article-preview-date">${currentDate}</span>`;
        
        previewHTML += '</div>';
        
        if (excerpt) {
          previewHTML += `<p class="article-preview-excerpt">${excerpt}</p>`;
        }
        
        previewHTML += '</div>';
        
        // Add featured image if available
        if (imageSrc) {
          previewHTML += `
            <div class="article-preview-image">
              <img src="${imageSrc}" alt="${title || 'Article Image'}">
            </div>
          `;
        }
        
        // Add content
        if (content) {
          previewHTML += `<div class="article-preview-content">${content}</div>`;
        } else {
          previewHTML += '<div class="article-preview-content"><p>No content yet. Start writing your article.</p></div>';
        }
        
        // Update preview
        contentPreview.innerHTML = previewHTML;
      } else {
        // If no content, show placeholder
        contentPreview.innerHTML = `
          <div class="preview-placeholder">
            <p>Nothing to preview yet.</p>
            <p>Add a title, image, and content, then click the Preview button.</p>
          </div>
        `;
      }
      
      // Switch to preview tab
      const previewTab = document.querySelector('[data-tab="preview-tab"]');
      if (previewTab) {
        // Manually trigger the tab switching
        const tabsContainer = previewTab.closest('.content-tabs');
        
        // Remove active class from all tabs and content
        tabsContainer.querySelectorAll('.tab-button').forEach(btn => {
          btn.classList.remove('active');
        });
        
        tabsContainer.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });
        
        // Add active class to preview tab and content
        previewTab.classList.add('active');
        document.getElementById('preview-tab').classList.add('active');
      }
    });
  }

  // Publish button functionality
  const publishButton = document.getElementById('publish-button');
  
  if (publishButton) {
    publishButton.addEventListener('click', function() {
      const title = document.getElementById('title')?.value;
      const category = document.getElementById('category')?.value;
      const content = document.getElementById('content')?.value;
      
      if (!title || !category || !content) {
        alert('Please fill in all required fields: Title, Category, and Content.');
        return;
      }
      
      alert('Article published successfully!');
      
      // In a real app, you would submit the form data to a server
      // For demo purposes, we'll just reset the form
      document.getElementById('article-form')?.reset();
      
      // Reset image preview
      if (imagePreviewContainer) {
        imagePreviewContainer.style.display = 'none';
      }
      
      if (contentPreview) {
        contentPreview.innerHTML = `
          <div class="preview-placeholder">
            <p>Nothing to preview yet.</p>
            <p>Add a title, image, and content, then click the Preview button.</p>
          </div>
        `;
      }
      
      // Switch back to write tab
      const writeTab = document.querySelector('[data-tab="write-tab"]');
      if (writeTab) {
        // Manually trigger the tab switching
        const tabsContainer = writeTab.closest('.content-tabs');
        
        // Remove active class from all tabs and content
        tabsContainer.querySelectorAll('.tab-button').forEach(btn => {
          btn.classList.remove('active');
        });
        
        tabsContainer.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });
        
        // Add active class to write tab and content
        writeTab.classList.add('active');
        document.getElementById('write-tab').classList.add('active');
      }
    });
  }

  // Copy link button functionality
  const copyLinkButton = document.querySelector('.copy-link-button');
  
  if (copyLinkButton) {
    copyLinkButton.addEventListener('click', function() {
      const currentUrl = window.location.href;
      
      // Create a temporary input element
      const tempInput = document.createElement('input');
      tempInput.value = currentUrl;
      document.body.appendChild(tempInput);
      
      // Select and copy the URL
      tempInput.select();
      document.execCommand('copy');
      
      // Remove the temporary input
      document.body.removeChild(tempInput);
      
      // Show feedback
      const originalText = this.textContent;
      this.textContent = 'Link Copied!';
      
      setTimeout(() => {
        this.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
          Copy Link
        `;
      }, 2000);
    });
  }
});

document.getElementById("article-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("category", document.getElementById("category").value);
  formData.append("excerpt", document.getElementById("excerpt").value);
  formData.append("content", document.getElementById("content").value);
  formData.append("tags", document.getElementById("tags").value);

  const fileInput = document.getElementById("featured-image");
  if (fileInput.files.length > 0) {
      formData.append("featuredImage", fileInput.files[0]);
  }

  try {
      const response = await fetch("http://localhost:5000/articles", {
          method: "POST",
          body: formData,
      });

      const result = await response.json();
      if (response.ok) {
          alert("Article uploaded successfully!");
          window.location.href = "articles.html"; // Redirect to articles page
      } else {
          alert("Error: " + result.error);
      }
  } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong!");
  }
});

  
  });