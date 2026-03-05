'use client';

import { ResourceFormDialog } from '@repo/ui/blocks/resource-form-dialog';
import { ResourceTable, type ResourceColumn } from '@repo/ui/blocks/resource-table';
import { Button } from '@repo/ui/primitives/button';
import { Input } from '@repo/ui/primitives/input';
import { PageHeader } from '@repo/ui/patterns/page-header';
import { Section } from '@repo/ui/patterns/section';
import { Toolbar } from '@repo/ui/patterns/toolbar';
import { useEffect, useMemo, useState } from 'react';
import type { SkillCategoryItem, SkillItem, SkillsTaxonomyResponse } from '../../../lib/chromedia-api';
import { apiFetch } from '../../../lib/chromedia-api';

const capabilityLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Senior Lead Level'] as const;

type CategoryForm = {
  name: string;
  slug: string;
  description: string;
};

type SkillForm = {
  name: string;
  code: string;
  description: string;
};

const initialCategoryForm: CategoryForm = {
  name: '',
  slug: '',
  description: ''
};

const initialSkillForm: SkillForm = {
  name: '',
  code: '',
  description: ''
};

function normalizeTaxonomy(taxonomy: SkillsTaxonomyResponse): SkillsTaxonomyResponse {
  return {
    ...taxonomy,
    categories: taxonomy.categories
      .map((category, categoryIndex) => ({
        ...category,
        displayOrder: category.displayOrder ?? categoryIndex,
        skills: category.skills.map((skill, skillIndex) => ({
          ...skill,
          displayOrder: skill.displayOrder ?? skillIndex
        }))
      }))
      .sort((a, b) => a.displayOrder - b.displayOrder)
  };
}

export default function AdminSkillsPage() {
  const [taxonomy, setTaxonomy] = useState<SkillsTaxonomyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [categoryForm, setCategoryForm] = useState<CategoryForm>(initialCategoryForm);
  const [skillForm, setSkillForm] = useState<SkillForm>(initialSkillForm);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  const loadTaxonomy = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<SkillsTaxonomyResponse>('/skills');
      setTaxonomy(normalizeTaxonomy(data));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTaxonomy();
  }, []);

  const persistTaxonomy = async (next: SkillsTaxonomyResponse) => {
    setLoading(true);
    setError(null);
    const previous = taxonomy;
    setTaxonomy(next);
    try {
      const saved = await apiFetch<SkillsTaxonomyResponse>('/skills', {
        method: 'PUT',
        body: JSON.stringify(next)
      });
      setTaxonomy(normalizeTaxonomy(saved));
    } catch (persistError) {
      setTaxonomy(previous);
      setError(persistError instanceof Error ? persistError.message : 'Failed to save skills');
    } finally {
      setLoading(false);
    }
  };

  const categories = taxonomy?.categories ?? [];
  const activeCategory = categories.find((category) => category.id === selectedCategoryId) ?? null;
  const activeSkill = activeCategory?.skills.find((skill) => skill.id === selectedSkillId) ?? null;

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredSkills = (activeCategory?.skills ?? []).filter((skill) =>
    skill.name.toLowerCase().includes(search.toLowerCase())
  );

  const categoryColumns = useMemo<Array<ResourceColumn<SkillCategoryItem>>>(
    () => [
      {
        key: 'name',
        header: 'Category',
        render: (row) => (
          <button
            className="text-left font-medium hover:underline"
            onClick={() => {
              setSelectedCategoryId(row.id ?? null);
              setSelectedSkillId(null);
            }}
          >
            {row.name}
          </button>
        )
      },
      {
        key: 'skills',
        header: 'Skills',
        render: (row) => String(row.skills.length)
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (row) => (
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              if (!taxonomy) return;
              if (!window.confirm(`Delete category "${row.name}"?`)) return;
              const next = {
                ...taxonomy,
                categories: taxonomy.categories.filter((category) => category.id !== row.id)
              };
              if (selectedCategoryId === row.id) {
                setSelectedCategoryId(null);
                setSelectedSkillId(null);
              }
              await persistTaxonomy(next);
            }}
          >
            Delete
          </Button>
        )
      }
    ],
    [taxonomy, selectedCategoryId]
  );

  const skillColumns = useMemo<Array<ResourceColumn<SkillItem>>>(
    () => [
      {
        key: 'name',
        header: 'Skill',
        render: (row) => (
          <button
            className="text-left font-medium hover:underline"
            onClick={() => setSelectedSkillId(row.id ?? null)}
          >
            {row.name}
          </button>
        )
      },
      {
        key: 'capabilityCount',
        header: 'Capabilities',
        render: (row) =>
          String(
            capabilityLevels.reduce((total, level) => total + row.capabilities[level].length, 0)
          )
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (row) => (
          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {
              if (!taxonomy || !activeCategory) return;
              if (!window.confirm(`Delete skill "${row.name}"?`)) return;
              const next = {
                ...taxonomy,
                categories: taxonomy.categories.map((category) =>
                  category.id === activeCategory.id
                    ? {
                        ...category,
                        skills: category.skills.filter((skill) => skill.id !== row.id)
                      }
                    : category
                )
              };
              if (selectedSkillId === row.id) {
                setSelectedSkillId(null);
              }
              await persistTaxonomy(next);
            }}
          >
            Delete
          </Button>
        )
      }
    ],
    [taxonomy, activeCategory, selectedSkillId]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skills"
        description="Manage taxonomy categories, skills, and capability levels."
        actions={
          selectedCategoryId ? (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategoryId(null);
                setSelectedSkillId(null);
              }}
            >
              Back to Categories
            </Button>
          ) : null
        }
      />

      <Toolbar
        left={
          <Input
            className="w-72"
            placeholder={
              selectedSkillId
                ? 'Search capability entries...'
                : selectedCategoryId
                  ? 'Search skills...'
                  : 'Search categories...'
            }
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        }
        right={
          !selectedCategoryId ? (
            <ResourceFormDialog
              trigger={<Button>New Skills Category</Button>}
              title="New Skills Category"
              submitLabel="Create"
              onSubmit={async (event) => {
                event.preventDefault();
                if (!taxonomy) return;
                const next: SkillsTaxonomyResponse = {
                  ...taxonomy,
                  categories: [
                    ...taxonomy.categories,
                    {
                      name: categoryForm.name.trim(),
                      slug: categoryForm.slug.trim() || null,
                      description: categoryForm.description.trim() || null,
                      displayOrder: taxonomy.categories.length,
                      skills: []
                    }
                  ]
                };
                setCategoryForm(initialCategoryForm);
                await persistTaxonomy(next);
              }}
            >
              <Input
                placeholder="Category name"
                value={categoryForm.name}
                onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })}
                required
              />
              <Input
                placeholder="Slug (optional)"
                value={categoryForm.slug}
                onChange={(event) => setCategoryForm({ ...categoryForm, slug: event.target.value })}
              />
              <Input
                placeholder="Description (optional)"
                value={categoryForm.description}
                onChange={(event) =>
                  setCategoryForm({ ...categoryForm, description: event.target.value })
                }
              />
            </ResourceFormDialog>
          ) : !selectedSkillId ? (
            <ResourceFormDialog
              trigger={<Button>Add New Skill</Button>}
              title="Add New Skill"
              submitLabel="Create"
              onSubmit={async (event) => {
                event.preventDefault();
                if (!taxonomy || !activeCategory) return;
                const next: SkillsTaxonomyResponse = {
                  ...taxonomy,
                  categories: taxonomy.categories.map((category) =>
                    category.id === activeCategory.id
                      ? {
                          ...category,
                          skills: [
                            ...category.skills,
                            {
                              name: skillForm.name.trim(),
                              code: skillForm.code.trim() || null,
                              description: skillForm.description.trim() || null,
                              displayOrder: category.skills.length,
                              capabilities: {
                                'Entry Level': [],
                                'Mid Level': [],
                                'Senior Level': [],
                                'Senior Lead Level': []
                              }
                            }
                          ]
                        }
                      : category
                  )
                };
                setSkillForm(initialSkillForm);
                await persistTaxonomy(next);
              }}
            >
              <Input
                placeholder="Skill name"
                value={skillForm.name}
                onChange={(event) => setSkillForm({ ...skillForm, name: event.target.value })}
                required
              />
              <Input
                placeholder="Code (optional)"
                value={skillForm.code}
                onChange={(event) => setSkillForm({ ...skillForm, code: event.target.value })}
              />
              <Input
                placeholder="Description (optional)"
                value={skillForm.description}
                onChange={(event) =>
                  setSkillForm({ ...skillForm, description: event.target.value })
                }
              />
            </ResourceFormDialog>
          ) : null
        }
      />

      {error ? (
        <Section title="Error">
          <p className="text-sm text-red-600">{error}</p>
        </Section>
      ) : null}

      {!selectedCategoryId ? (
        <Section title="Skills Categories" description="Top-level taxonomy categories.">
          <ResourceTable
            columns={categoryColumns}
            rows={filteredCategories}
            loading={loading}
            emptyTitle="No skill categories yet"
            emptyDescription="Create your first skills category."
            getRowId={(row) => row.id ?? row.name}
          />
        </Section>
      ) : !selectedSkillId ? (
        <Section
          title={activeCategory?.name ?? 'Skills'}
          description={activeCategory?.description ?? 'Skills in selected category.'}
        >
          <ResourceTable
            columns={skillColumns}
            rows={filteredSkills}
            loading={loading}
            emptyTitle="No skills yet"
            emptyDescription="Add a skill under this category."
            getRowId={(row) => row.id ?? row.name}
          />
        </Section>
      ) : (
        <Section title={activeSkill?.name ?? 'Capabilities'} description="Capability levels by seniority.">
          <div className="grid gap-4 md:grid-cols-2">
            {capabilityLevels.map((level) => {
              const entries = activeSkill?.capabilities[level] ?? [];
              const filteredEntries = entries.filter((entry) =>
                entry.toLowerCase().includes(search.toLowerCase())
              );
              return (
                <div key={level} className="rounded-md border border-slate-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-medium">{level}</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        if (!taxonomy || !activeCategory || !activeSkill) return;
                        const entry = window.prompt(`Add capability for ${level}`);
                        if (!entry?.trim()) return;
                        const next: SkillsTaxonomyResponse = {
                          ...taxonomy,
                          categories: taxonomy.categories.map((category) =>
                            category.id === activeCategory.id
                              ? {
                                  ...category,
                                  skills: category.skills.map((skill) =>
                                    skill.id === activeSkill.id
                                      ? {
                                          ...skill,
                                          capabilities: {
                                            ...skill.capabilities,
                                            [level]: [...skill.capabilities[level], entry.trim()]
                                          }
                                        }
                                      : skill
                                  )
                                }
                              : category
                          )
                        };
                        await persistTaxonomy(next);
                      }}
                    >
                      Add New Capability
                    </Button>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {filteredEntries.length ? (
                      filteredEntries.map((entry) => (
                        <li key={entry} className="flex items-center justify-between rounded bg-slate-50 px-2 py-1">
                          <span>{entry}</span>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={async () => {
                              if (!taxonomy || !activeCategory || !activeSkill) return;
                              const next: SkillsTaxonomyResponse = {
                                ...taxonomy,
                                categories: taxonomy.categories.map((category) =>
                                  category.id === activeCategory.id
                                    ? {
                                        ...category,
                                        skills: category.skills.map((skill) =>
                                          skill.id === activeSkill.id
                                            ? {
                                                ...skill,
                                                capabilities: {
                                                  ...skill.capabilities,
                                                  [level]: skill.capabilities[level].filter(
                                                    (item) => item !== entry
                                                  )
                                                }
                                              }
                                            : skill
                                        )
                                      }
                                    : category
                                )
                              };
                              await persistTaxonomy(next);
                            }}
                          >
                            Remove
                          </Button>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500">No capabilities yet.</li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </Section>
      )}
    </div>
  );
}
