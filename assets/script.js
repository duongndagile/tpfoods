// Toast helper
function showToast(msg, color = 'green') {
  let toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.position = 'fixed';
  toast.style.top = '32px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = color === 'green' ? '#43a047' : (color === 'red' ? '#d32f2f' : '#333');
  toast.style.color = '#fff';
  toast.style.padding = '14px 28px';
  toast.style.fontSize = '1.1rem';
  toast.style.borderRadius = '8px';
  toast.style.boxShadow = '0 2px 12px #0003';
  toast.style.zIndex = 9999;
  toast.style.opacity = 0.98;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.5s';
    toast.style.opacity = 0;
    setTimeout(() => toast.remove(), 500);
  }, 2200);
}
const API_URL = "https://script.google.com/macros/s/AKfycbyZlZRZJ_gE4TCJhjch1hrzPb18xlZsgeIoc7LszMNwhcvNET8eDDUt4slUqm7CftcFGw/exec";

async function submitForm(product) {
    // Sync checkbox and quantity logic for size M and L (run immediately, not just on submit)
    function setupSizeQuantitySync() {
      const sCheckbox = form.sizeS;
      const mCheckbox = form.sizeM;
      const lCheckbox = form.sizeL;
      const sQuantity = form.sQuantity;
      const mQuantity = form.mQuantity;
      const lQuantity = form.lQuantity;
      if (sCheckbox && sQuantity) {
        sCheckbox.addEventListener('change', function() {
          if (sCheckbox.checked) {
            if (!sQuantity.value || parseInt(sQuantity.value, 10) < 1) sQuantity.value = 1;
          } else {
            sQuantity.value = '';
          }
        });
        sQuantity.addEventListener('input', function() {
          if (parseInt(sQuantity.value, 10) > 0) {
            sCheckbox.checked = true;
          } else {
            sCheckbox.checked = false;
          }
        });
      }
      if (mCheckbox && mQuantity) {
        mCheckbox.addEventListener('change', function() {
          if (mCheckbox.checked) {
            if (!mQuantity.value || parseInt(mQuantity.value, 10) < 1) mQuantity.value = 1;
          } else {
            mQuantity.value = '';
          }
        });
        mQuantity.addEventListener('input', function() {
          if (parseInt(mQuantity.value, 10) > 0) {
            mCheckbox.checked = true;
          } else {
            mCheckbox.checked = false;
          }
        });
      }
      if (lCheckbox && lQuantity) {
        lCheckbox.addEventListener('change', function() {
          if (lCheckbox.checked) {
            if (!lQuantity.value || parseInt(lQuantity.value, 10) < 1) lQuantity.value = 1;
          } else {
            lQuantity.value = '';
          }
        });
        lQuantity.addEventListener('input', function() {
          if (parseInt(lQuantity.value, 10) > 0) {
            lCheckbox.checked = true;
          } else {
            lCheckbox.checked = false;
          }
        });
      }
    }
    // Run sync logic immediately after DOMContentLoaded, not just on submit
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupSizeQuantitySync);
    } else {
      setupSizeQuantitySync();
    }
  const form = document.querySelector("form");
  const messageEl = document.querySelector(".message");
  const submitBtn = form.querySelector('button[type="submit"]');

  if (!form) return;

  // Tránh gán nhiều lần
  if (form._hasSubmitHandler) return;
  form._hasSubmitHandler = true;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const address = form.address.value.trim();
    const note = form.note.value.trim();

    // Handle new size/quantity fields
    const sizeSChecked = form.sizeS && form.sizeS.checked;
    const sizeMChecked = form.sizeM && form.sizeM.checked;
    const sizeLChecked = form.sizeL && form.sizeL.checked;
    const sQuantity = form.sQuantity ? parseInt(form.sQuantity.value, 10) || 0 : 0;
    const mQuantity = form.mQuantity ? parseInt(form.mQuantity.value, 10) || 0 : 0;
    const lQuantity = form.lQuantity ? parseInt(form.lQuantity.value, 10) || 0 : 0;

    // Build order details
    let sizes = [];
    if (sizeSChecked && sQuantity > 0) sizes.push({ size: 'S', quantity: sQuantity });
    if (sizeMChecked && mQuantity > 0) sizes.push({ size: 'M', quantity: mQuantity });
    if (sizeLChecked && lQuantity > 0) sizes.push({ size: 'L', quantity: lQuantity });

    if (submitBtn) {
      submitBtn.disabled = true;
      var oldBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Đang gửi...';
    }

    if (!name || !phone) {
      showToast("Vui lòng nhập tên và số điện thoại", 'red');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = oldBtnText;
      }
      return;
    }
    if (sizes.length === 0) {
      showToast("Chọn ít nhất 1 size và nhập số lượng > 0", 'red');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = oldBtnText;
      }
      return;
    }

    try {
      if (messageEl) {
        messageEl.textContent = "Đang gửi...";
        messageEl.style.color = "black";
      }
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          product,
          name,
          phone,
          address,
          note,
          sizes, // array of {size, quantity}
          createdAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed");

      if (messageEl) {
        messageEl.textContent = "Đăng ký thành công! Chúng tôi sẽ liên hệ sớm.";
        messageEl.style.color = "green";
      }
      showToast("Đăng ký thành công! Chúng tôi sẽ liên hệ sớm.", 'green');
      
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = oldBtnText;
      }
      form.reset();
    } catch (err) {
      if (messageEl) {
        messageEl.textContent = "Có lỗi xảy ra, vui lòng thử lại.";
        messageEl.style.color = "red";
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = oldBtnText;
      }
      showToast("Có lỗi xảy ra, vui lòng thử lại.", 'red');
    }
  });
}
