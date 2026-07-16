import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import apiClient from "../../api/axiosClient";

interface Props {
  companyId?: string;
  onTagsChanged?: (count: number) => void;
}

export default function DepartmentTaggingStep({ companyId: companyIdProp, onTagsChanged }: Props) {
  const [tags, setTags] = useState<{ _id: string; name: string }[]>([]);
  const [newTag, setNewTag] = useState("");
  const [companyId, setCompanyId] = useState<string | undefined>(companyIdProp);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTags();
    if (!companyIdProp) {
      // Fallback for when this step is used standalone without a companyId prop.
      apiClient.get("/company")
        .then((res) => setCompanyId(res.data._id))
        .catch((err) => console.error("Error fetching company", err));
    }
  }, []);

  const fetchTags = async () => {
    try {
      const res = await apiClient.get("/departments");
      setTags(res.data);
      onTagsChanged?.(res.data.length);
    } catch (error) {
      console.error("Error fetching tags", error);
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    if (!companyId) {
      setError("Company details are still loading. Please try again in a moment.");
      return;
    }

    try {
      setError(null);
      await apiClient.post("/departments", { companyId, name: newTag.trim() });
      setNewTag("");
      fetchTags();
    } catch (error: any) {
      console.error("Error adding tag", error);
      setError(error?.response?.data?.message || "Failed to add tag");
    }
  };

  const handleRemoveTag = async (id: string) => {
    try {
      await apiClient.delete(`/departments/${id}`);
      fetchTags();
    } catch (error) {
      console.error("Error removing tag", error);
    }
  };

  return (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6">
      <div className="flex items-center space-x-4 mb-2">
        <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(16,185,129,0.3)]">2</div>
        <h2 className="text-xl font-light tracking-wide text-zinc-100">Department Tagging Engine</h2>
      </div>
      <p className="text-sm text-zinc-500 mb-8 ml-14">Create Department Tags (Used for future categorization & filtering)</p>

      {error && (
        <div className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {error}
        </div>
      )}
      
      <form onSubmit={handleAddTag} className="flex space-x-3 mb-8">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="flex-grow bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
          placeholder="New Tag Name (e.g. Finance)"
        />
        <button
          type="submit"
          disabled={!newTag.trim()}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-bold uppercase tracking-wide px-6 py-3 rounded-lg transition-colors text-sm flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>ADD TAG</span>
        </button>
      </form>

      <div>
        <h3 className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-4">Active Tags</h3>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <div key={tag._id} className="flex items-center space-x-2 bg-zinc-900 text-zinc-200 px-4 py-2 rounded-lg text-sm border border-white/5">
              <span className="font-medium tracking-wide">{tag.name}</span>
              <button onClick={() => handleRemoveTag(tag._id)} className="text-zinc-500 hover:text-red-400 focus:outline-none transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {tags.length === 0 && (
            <p className="text-sm text-zinc-600 italic">No tags created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
