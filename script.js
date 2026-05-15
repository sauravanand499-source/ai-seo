const state = {
  drafts: JSON.parse(localStorage.getItem('drafts') || '[]'),
  published: JSON.parse(localStorage.getItem('published') || '[]'),
  campaigns: JSON.parse(localStorage.getItem('campaigns') || '[]')
};

const toolOutput = document.getElementById('toolOutput');

function saveState() {
  localStorage.setItem('drafts', JSON.stringify(state.drafts));
  localStorage.setItem('published', JSON.stringify(state.published));
  localStorage.setItem('campaigns', JSON.stringify(state.campaigns));
  renderStats();
  renderCampaigns();
}

function renderStats() {
  document.getElementById('draftCount').textContent = state.drafts.length;
  document.getElementById('publishedCount').textContent = state.published.length;
  document.getElementById('campaignCount').textContent = state.campaigns.length;
}

function renderCampaigns() {
  const list = document.getElementById('campaignList');
  list.innerHTML = state.campaigns.map(c => `<li>${c}</li>`).join('');
}

document.querySelectorAll('.tool-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tool = btn.dataset.tool;
    const responses = {
      planner: 'Content Planner:\n- Cluster keywords\n- Weekly publishing schedule\n- Suggested funnel topics',
      chatbot: 'Digital Marketing Answer Bot:\nAsk anything about SEO, ads, CRO, analytics, and strategy.',
      ab: 'A/B Testing Tool:\nCreate variant A/B headlines, CTA versions, and conversion goals.',
      campaign: 'Campaigning Tool:\nBuild channel mix, budget split, and launch checklist.',
      generator: 'AI Article Generator is active. Use title + keywords to generate drafts.',
      competitor: 'Competitor Data:\nTrack competitor keywords, backlinks, and content gaps.'
    };
    toolOutput.textContent = responses[tool] || 'Tool ready.';
  });
});

document.getElementById('launchCampaignBtn').addEventListener('click', () => {
  const input = document.getElementById('campaignName');
  if (!input.value.trim()) return;
  state.campaigns.push(input.value.trim());
  input.value = '';
  saveState();
});

function currentPost() {
  return {
    title: document.getElementById('postTitle').value.trim(),
    writer: document.getElementById('writerName').value.trim(),
    linkedin: document.getElementById('writerLinkedIn').value.trim(),
    content: document.getElementById('postContent').value.trim(),
    date: new Date().toISOString()
  };
}

document.getElementById('previewBtn').addEventListener('click', () => {
  const post = currentPost();
  document.getElementById('postPreview').innerHTML = `
    <h4>${post.title || 'Untitled'}</h4>
    <p><strong>Writer:</strong> ${post.writer || 'Unknown'}</p>
    <p><strong>LinkedIn:</strong> ${post.linkedin || 'N/A'}</p>
    <hr/>
    <p>${post.content || 'No content yet.'}</p>
  `;
});

document.getElementById('saveDraftBtn').addEventListener('click', () => {
  const post = currentPost();
  if (!post.title || !post.content) return alert('Title and content are required for draft.');
  state.drafts.push(post);
  saveState();
  alert('Draft saved.');
});

document.getElementById('publishBtn').addEventListener('click', () => {
  const post = currentPost();
  if (!post.title || !post.content) return alert('Title and content are required to publish.');
  state.published.push(post);
  saveState();
  alert('Post published.');
});

document.getElementById('subscribeBtn').addEventListener('click', () => {
  const email = document.getElementById('subscriberEmail').value.trim();
  const msg = document.getElementById('subscribeMsg');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msg.textContent = 'Enter a valid email address.';
    return;
  }
  msg.textContent = `Subscribed: ${email}`;
  document.getElementById('subscriberEmail').value = '';
});

const tourSteps = [
  { title: 'AI Toolkit', text: 'Use AI tools like Content Planner, A/B Testing, Campaigning, and Generator.' },
  { title: 'Dashboard', text: 'Monitor drafts, published posts, and campaigns from this panel.' },
  { title: 'Launch Campaign', text: 'Enter a campaign name and click Launch Campaign.' },
  { title: 'Blog Workflow', text: 'Preview, save drafts, and publish posts with writer + LinkedIn details.' }
];
let tourIndex = 0;

function showTourStep() {
  const modal = document.getElementById('tourModal');
  const step = tourSteps[tourIndex];
  document.getElementById('tourTitle').textContent = step.title;
  document.getElementById('tourText').textContent = step.text;
  modal.classList.remove('hidden');
}

function startTour() {
  tourIndex = 0;
  showTourStep();
}

document.getElementById('tourNextBtn').addEventListener('click', () => {
  tourIndex += 1;
  if (tourIndex >= tourSteps.length) {
    document.getElementById('tourModal').classList.add('hidden');
    return;
  }
  showTourStep();
});

document.getElementById('tourCloseBtn').addEventListener('click', () => {
  document.getElementById('tourModal').classList.add('hidden');
});

document.getElementById('startTourBtn').addEventListener('click', startTour);
document.getElementById('onboardingStart').addEventListener('click', () => {
  document.getElementById('onboarding').classList.add('hidden');
  localStorage.setItem('tourDismissed', '1');
  startTour();
});
document.getElementById('onboardingDismiss').addEventListener('click', () => {
  document.getElementById('onboarding').classList.add('hidden');
  localStorage.setItem('tourDismissed', '1');
});

if (!localStorage.getItem('tourDismissed')) {
  document.getElementById('onboarding').classList.remove('hidden');
}

renderStats();
renderCampaigns();
