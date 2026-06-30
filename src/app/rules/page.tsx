import { Crown } from "lucide-react";

export default function RulesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div 
        className="backdrop-blur-2xl rounded-[2rem] p-8 lg:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border transition-all duration-500 relative overflow-hidden"
        style={{ 
          background: 'var(--theme-panel-bg, var(--color-wood-800))',
          borderColor: 'var(--color-treasure-600)'
        }}
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Crown size={200} style={{ color: 'var(--color-treasure-400)' }} />
        </div>
        
        <h1 
          className="text-4xl font-bold mb-8 relative z-10 flex items-center gap-4"
          style={{ color: 'var(--color-treasure-400)', fontFamily: 'var(--theme-font, var(--font-serif))' }}
        >
          Prompt Party 2.0 Rules
        </h1>

        <div className="space-y-12 relative z-10 text-ocean-100 text-lg">
          <section>
            <h2 className="text-3xl font-semibold mb-6 text-treasure-300 border-b border-treasure-600/30 pb-2">📜 Rules</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-4"><span className="text-2xl leading-none mt-1">👑</span> <span>Only the <strong>Team Leader</strong> can upload files to Google Drive</span></li>
              <li className="flex items-start gap-4"><span className="text-2xl leading-none mt-1">🔹</span> <span>All tasks must use <strong>Gemini AI</strong> for image and video generation</span></li>
              <li className="flex items-start gap-4"><span className="text-2xl leading-none mt-1">📂</span> <span>Submissions must include: <br/><span className="text-ocean-300 text-base mt-2 block pl-2 border-l-2 border-treasure-600/50">- Final output (image/video)<br/>- Prompt document with screenshots, tool/model info, number of attempts, and explanation</span></span></li>
              <li className="flex items-start gap-4"><span className="text-2xl leading-none mt-1">⏱</span> <span>Round time limit: <strong>30 minutes</strong> per round</span></li>
              <li className="flex items-start gap-4"><span className="text-2xl leading-none mt-1">👀</span> <span>Everyone can view all teams and their progress in the portal</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-treasure-300 border-b border-treasure-600/30 pb-2">🏴‍☠️ Event Parts</h2>
            
            <div className="space-y-6">
              <div className="bg-ocean-950/40 p-6 rounded-xl border border-ocean-700/50 shadow-inner">
                <h3 className="text-2xl font-bold mb-4 text-treasure-400">⚔️ Round 1 – Prompt Battle (Image Generation)</h3>
                <ul className="space-y-2">
                  <li><strong className="text-ocean-50">Inputs:</strong> Weak prompt + Product image</li>
                  <li><strong className="text-ocean-50">Task:</strong> Improve the prompt and generate the final image using Gemini</li>
                  <li><strong className="text-ocean-50">Time Limit:</strong> 30 minutes</li>
                  <li><strong className="text-ocean-50">Submission:</strong> Final prompt document + generated image</li>
                  <li><strong className="text-ocean-50">Evaluation:</strong> AI evaluates the prompt; Founders evaluate the image</li>
                </ul>
              </div>

              <div className="bg-ocean-950/40 p-6 rounded-xl border border-ocean-700/50 shadow-inner">
                <h3 className="text-2xl font-bold mb-4 text-treasure-400">🎬 Round 2 – Devil Fruit Challenge (Video Generation)</h3>
                <ul className="space-y-2">
                  <li><strong className="text-ocean-50">Inputs:</strong> Product image from Round 1</li>
                  <li><strong className="text-ocean-50">Wheel:</strong> There will be 4 wheels - Theme, genre, mood and visual style.</li>
                  <li><strong className="text-ocean-50">Task:</strong> Generate a promotional video using Gemini based on the assigned theme/genre</li>
                  <li><strong className="text-ocean-50">Time Limit:</strong> 30 minutes</li>
                  <li><strong className="text-ocean-50">Submission:</strong> Final prompt document + generated video</li>
                  <li><strong className="text-ocean-50">Evaluation:</strong> AI evaluates the prompt; Founders evaluate the video</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold mb-6 text-treasure-300 border-b border-treasure-600/30 pb-2">🏆 Evaluation Rules</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-ocean-950/40 p-6 rounded-xl border border-ocean-700/50 shadow-inner">
                <h3 className="text-xl font-bold mb-4 text-treasure-400 flex items-center gap-2"><span className="text-2xl">🤖</span> Prompt Evaluation (AI)</h3>
                <ul className="list-disc list-inside space-y-2 text-base text-ocean-200">
                  <li>Clarity & grammar</li>
                  <li>Completeness of instructions</li>
                  <li>Structure & logical flow</li>
                  <li>Product understanding & relevance</li>
                  <li>Inclusion of scene/visual instructions</li>
                </ul>
              </div>

              <div className="bg-ocean-950/40 p-6 rounded-xl border border-ocean-700/50 shadow-inner">
                <h3 className="text-xl font-bold mb-4 text-treasure-400 flex items-center gap-2"><span className="text-2xl">🧑‍✈️</span> Output Evaluation (Founders)</h3>
                <ul className="list-disc list-inside space-y-2 text-base text-ocean-200">
                  <li>Visual quality (resolution, realism, finish)</li>
                  <li>Creativity & innovation</li>
                  <li>Product consistency</li>
                  <li>Theme adherence (Round 2)</li>
                  <li>Overall execution & impact</li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-ocean-950/40 p-6 rounded-xl border border-ocean-700/50 shadow-inner">
                <h3 className="text-xl font-bold mb-4 text-treasure-400 flex items-center gap-2"><span className="text-2xl">🔹</span> Scoring</h3>
                <ul className="list-disc list-inside space-y-2 text-base text-ocean-200">
                  <li><strong>60%</strong> AI prompt rating</li>
                  <li><strong>40%</strong> Founder output evaluation</li>
                  <li>The combined score determines rankings and the winner</li>
                </ul>
              </div>

              <div className="bg-red-900/20 p-6 rounded-xl border border-red-500/50 flex flex-col items-center justify-center text-center shadow-[inset_0_0_30px_rgba(239,68,68,0.1)]">
                <span className="text-4xl mb-3">⚠️</span>
                <h3 className="text-xl font-bold mb-2 text-red-400">Disqualification</h3>
                <p className="text-red-200 text-base">Incomplete submissions or failing prompt rules</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
