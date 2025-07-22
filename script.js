  const btn = document.getElementById('getWeatherBtn');
  const input = document.getElementById('cityInput');
  const loading = document.getElementById('loading');
  const errorDiv = document.getElementById('error');
  const card = document.getElementById('weatherCard');
  const nameEl = document.getElementById('cityName');
  const tempEl = document.getElementById('temperature');
  const condEl = document.getElementById('condition');
  const iconEl = document.getElementById('icon');
  const wrapper = document.getElementById('appWrapper');
  const toggleTheme = document.getElementById('toggleTheme');

  // Store gradients per weather + theme
  const gradients = {
    light: {
      sun: 'from-yellow-300 via-orange-200 to-yellow-500',
      cloud: 'from-gray-200 via-gray-400 to-gray-600',
      rain: 'from-blue-300 via-blue-400 to-blue-600',
      default: 'from-sky-300 via-indigo-300 to-blue-400',
    },
    dark: {
      sun: 'from-yellow-800 via-orange-700 to-yellow-600',
      cloud: 'from-gray-900 via-gray-800 to-gray-700',
      rain: 'from-blue-900 via-blue-800 to-blue-700',
      default: 'from-gray-950 via-gray-900 to-gray-800',
    },
  };

  function applyGradient(condition) {
    const isDark = document.documentElement.classList.contains('dark');
    const theme = isDark ? 'dark' : 'light';

    condition = condition.toLowerCase();
    let gradient = gradients[theme].default;

    if (condition.includes('sun')) gradient = gradients[theme].sun;
    else if (condition.includes('cloud')) gradient = gradients[theme].cloud;
    else if (condition.includes('rain')) gradient = gradients[theme].rain;

    wrapper.className =
      `flex flex-col items-center justify-center min-h-screen px-4 py-6 bg-gradient-to-br ${gradient} transition-all duration-700`;
  }

  async function getWeather(city) {
    loading.classList.remove('hidden');
    errorDiv.textContent = '';
    card.classList.add('hidden');

    try {
      const key = 'ac6aec2729b645959db182942252207';
      const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${key}&q=${encodeURIComponent(city)}`);
      const out = await res.json();

      if (res.ok) {
        nameEl.textContent = `${out.location.name}, ${out.location.country}`;
        tempEl.textContent = `🌡️ ${out.current.temp_c}°C`;
        condEl.textContent = out.current.condition.text;
        iconEl.src = 'https:' + out.current.condition.icon;
        card.classList.remove('hidden');
        localStorage.setItem('lastCity', city);
        applyGradient(out.current.condition.text);
      } else {
        throw new Error(out.error.message);
      }
    } catch (err) {
      errorDiv.textContent = err.message;
    } finally {
      loading.classList.add('hidden');
    }
  }

  btn.addEventListener('click', () => {
    const city = input.value.trim();
    if (city) getWeather(city);
  });

  window.addEventListener('DOMContentLoaded', () => {
    const last = localStorage.getItem('lastCity');
    if (last) {
      input.value = last;
      getWeather(last);
    }
  });

  toggleTheme.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const city = input.value.trim();
    if (city) getWeather(city);
    else applyGradient(''); // fallback for theme switch without city
  });