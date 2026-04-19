/**
 * AI Service - Interface for Google Gemini API
 * Current implementation uses structured mocks for Phase 1.
 */

const analyzeResume = async (resumeText) => {
  console.log('AI Service: Mocking Resume Analysis...');
  
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Placeholder for real Gemini implementation:
  // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  // const prompt = "...";
  // const result = await model.generateContent(prompt);

  return {
    score: 75,
    summary: "Your profile shows strong foundational skills in full-stack development. However, specialized cloud certifications could boost your visibility.",
    strengths: ["Strong JavaScript proficiency", "Clean code practices", "Experience with React ecosystems"],
    gaps: ["Missing AWS/Azure exposure", "Lacks unit testing experience", "No production deployment history"],
    recommendations: [
      "Add a cloud project to your portfolio",
      "Learn Jest or Vitest for testing",
      "Contribute to open-source to show collaboration"
    ]
  };
};

const getRoadmapAdvice = async (profile, roadmap, progress) => {
  console.log('AI Service: Mocking Roadmap Advice...');
  
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    advice: "You are currently 60% through your Frontend path. Focus on mastering state management (Redux/Zustand) next as it's a high-demand skill for several open drives in your marketplace.",
    priority_steps: [roadmap.steps[2]?.id || 'next_step'],
    motivation: "You've been consistent this week! Keep the momentum going to unlock the Elite Placement kits."
  };
};

module.exports = {
  analyzeResume,
  getRoadmapAdvice
};
