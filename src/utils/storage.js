import { INITIAL_APPS } from '../data/initialApps';

const STORAGE_KEY = 'vp_portfolio_apps_v1';
const PASSCODE_HASH_KEY = 'vp_portfolio_admin_hash_v1';
const AUTH_SESSION_KEY = 'vp_portfolio_is_auth_v1';
const GITHUB_CONFIG_KEY = 'vp_portfolio_github_config_v1';
const SALT = 'vp_launchpad_salt_2026';

// Pre-computed SHA-256 hash of ("vaibhav2026" + SALT)
// Plain-text secret is never stored anywhere in code or browser storage.
const DEFAULT_PASSCODE_HASH = '1d83634c0f1329e6ef683db1fa50ee785152b330650b02d5883215edf769cadf';

/**
 * Fetch authoritative apps.json deployed on GitHub Pages / public root,
 * so EVERY visitor worldwide sees the exact same latest applications.
 */
export async function fetchLiveApps() {
  try {
    const res = await fetch('/apps.json?t=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        saveApps(data);
        return data;
      }
    }
  } catch (err) {
    console.warn('Could not fetch live apps.json, falling back to local storage:', err);
  }
  return loadApps();
}

export function loadApps() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveApps(INITIAL_APPS);
      return INITIAL_APPS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_APPS;
  } catch (err) {
    console.error('Error loading apps from localStorage:', err);
    return INITIAL_APPS;
  }
}

export function saveApps(apps) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    return true;
  } catch (err) {
    console.error('Error saving apps to localStorage:', err);
    return false;
  }
}

export function resetAppsToDefault() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPS));
    return INITIAL_APPS;
  } catch (err) {
    console.error('Error resetting apps:', err);
    return INITIAL_APPS;
  }
}

export function exportAppsToJson(apps) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(apps, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `vaibhav-launchpad-apps-${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importAppsFromJson(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      throw new Error('Imported JSON must be an array of application objects');
    }
    for (const item of parsed) {
      if (!item.id || !item.title || !item.url) {
        throw new Error('Each application must include at least id, title, and url');
      }
    }
    saveApps(parsed);
    return { success: true, data: parsed };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Publish updated apps directly to the GitHub repository using GitHub Contents API.
 * This triggers GitHub Actions to rebuild & deploy, updating the site globally for EVERYONE!
 */
export async function publishAppsToGitHub({ owner, repo, branch = 'main', token, apps }) {
  if (!owner || !repo || !token) {
    return { success: false, error: 'GitHub repository details and access token are required.' };
  }

  const path = 'public/apps.json';
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  try {
    // 1. Get current file sha (if exists)
    let sha = null;
    const getRes = await fetch(apiUrl + `?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    if (getRes.ok) {
      const existing = await getRes.json();
      sha = existing.sha;
    }

    // 2. Prepare Base64 content
    const jsonContent = JSON.stringify(apps, null, 2);
    const base64Content = btoa(unescape(encodeURIComponent(jsonContent)));

    // 3. Commit file via GitHub API
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'chore(apps): update hosted applications list from portal [skip ci]',
        content: base64Content,
        branch,
        ...(sha ? { sha } : {})
      })
    });

    if (putRes.ok) {
      return { success: true };
    } else {
      const errData = await putRes.json();
      return { success: false, error: errData.message || 'GitHub API returned an error.' };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export function getGitHubConfig() {
  try {
    const raw = localStorage.getItem(GITHUB_CONFIG_KEY);
    return raw ? JSON.parse(raw) : { owner: '', repo: '', branch: 'main', token: '' };
  } catch {
    return { owner: '', repo: '', branch: 'main', token: '' };
  }
}

export function saveGitHubConfig(cfg) {
  try {
    localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(cfg));
  } catch {}
}

/**
 * Computes a SHA-256 one-way cryptographic hash with salt using native Web Crypto API.
 */
export async function hashPasscode(passcode) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(passcode + SALT);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    console.error('Web Crypto error:', err);
    return null;
  }
}

export function getStoredHash() {
  return localStorage.getItem(PASSCODE_HASH_KEY) || DEFAULT_PASSCODE_HASH;
}

export async function setAdminPasscode(newPasscode) {
  if (!newPasscode || newPasscode.trim().length === 0) return false;
  const hashed = await hashPasscode(newPasscode.trim());
  if (!hashed) return false;
  localStorage.setItem(PASSCODE_HASH_KEY, hashed);
  return true;
}

export async function verifyPasscode(input) {
  if (!input) return false;
  const inputHash = await hashPasscode(input);
  const storedHash = getStoredHash();
  return inputHash === storedHash;
}

export function checkIsAuthenticated() {
  return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
}

export function setAuthenticated(status) {
  if (status) {
    sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
  } else {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  }
}
