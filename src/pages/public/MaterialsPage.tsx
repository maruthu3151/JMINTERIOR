import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, Clock, Hammer } from 'lucide-react';
import { getMaterials } from '../../services/materialsService';
import { MaterialItem } from '../../types';

export const MaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMaterials(true);
        setMaterials(data);
      } catch (err) {
        console.error('Failed to load materials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase font-semibold tracking-widest text-wood-700">
          Raw Material Quality
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mt-2">
          Materials, Timber & Finishes
        </h1>
        <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
          At JM INTERIOR, the longevity of our interiors begins with honest materials. We use genuine Boiling Water Proof (BWP) 710 marine ply, seasoned solid teak, and authentic natural timber veneers specifically resilient against coastal Chennai moisture.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 bg-stone-200 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {materials.map((mat) => (
            <div
              key={mat.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition flex flex-col"
            >
              {mat.imageUrl && (
                <div className="h-48 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={mat.imageUrl}
                    alt={mat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                    {mat.name}
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
                    {mat.description}
                  </p>

                  {/* Attribute Specs */}
                  <div className="mt-6 space-y-3 pt-6 border-t border-stone-100 text-xs sm:text-sm">
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-wood-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-stone-900">Properties: </span>
                        <span className="text-stone-600">{mat.properties}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-wood-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-stone-900">Durability & Lifespan: </span>
                        <span className="text-stone-600">{mat.durability}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-wood-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-stone-900">Finish Options: </span>
                        <span className="text-stone-600">{mat.finish}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Hammer className="w-4 h-4 text-wood-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-stone-900">Recommended Usage: </span>
                        <span className="text-stone-600">{mat.usage}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-wood-800 font-semibold">
                  <span>Factory Direct Joinery</span>
                  <span>Chennai Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
