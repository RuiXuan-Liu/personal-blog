# KDD 2019：Representation Learning for Attributed Multiplex Heterogeneous Network

原文链接：[Representation Learning for Attributed Multiplex Heterogeneous Network (arxiv.org)](https://arxiv.org/pdf/1905.01669)

# 摘要

Network embedding(or graph embedding) has been widely used in many real-world applications. However, existing methods mainly focus on networks with single-typed nodes/edges and cannot scale well to handle large networks. Many real-world networks consist of billions of nodes and edges of multiple types, and each node is associated with different attributes. In this paper, we formalize the problem of embedding learning for the Attributed Multiplex Heterogeneous Network and propose a unified framework to ad-dress this problem. The framework supports both transductive and inductive learning. We also give the theoretical analysis of the pro-posed framework, showing its connection with previous works and proving its better expressiveness. We conduct systematical eval-uations for the proposed framework on four different genres of challenging datasets: Amazon, YouTube, Twitter, and Alibaba1. Ex-perimental results demonstrate that with the learned embeddings from the proposed framework, we can achieve statistically signif-icant improvements(e.g., 5.99-28.23% lift by F1 scores; p < 0.01, t−test) over previous state-of-the-art methods for link prediction. The framework has also been successfully deployed on the recom-mendation system of a worldwide leading e-commerce company, Alibaba Group. Results of the offline A/B tests on product recom-mendation further confirm the effectiveness and efficiency of the framework in practice.

# 预备知识 

在阅读这篇文章之前，我们先来看一下什么是图嵌入表示学习

参考资料：[随机游走的艺术-图嵌入表示学习【斯坦福CS224W图机器学习】_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1AP4y1r7Pz/?spm_id_from=333.337.search-card.all.click&vd_source=ddf866c89a9a03fd980dc08938825288)

## 嵌入（embedding）

首先我们给出机器学习中嵌入的定义

> ***定义***
>
> 把离散的、分类型的数据投影到连续向量表达的过程

在处理复杂图形数据时，计算机通常难以直接理解其中的结构和关系。为了使计算机能够有效处理这些信息，我们需要将图中的节点和边转化为可计算的向量形式，这一过程就是我们常说的“嵌入”(Embedding)。通过嵌入技术，每个节点可以被表示为一个向量，这个向量能够捕捉到节点自身的属性以及它与其他节点之间的关系。同样地，边也可以被嵌入到向量空间中，用来表示不同节点之间的连接强度或类型。

## 图表示学习

自然语言处理的许多概念和图表示学习有许多相似性，在学习中，我们可以类比学习

![](https://pic.imgdb.cn/item/670c7f48d29ded1a8c9523fb.png)

### 图节点嵌入

节点u通过一个映射函数f从图空间到d维向量空间。这个过程将节点映射为d维向量，使得向量维度远小于节点数，如下图所示。
向量化后的特征具有以下几个特点：

- 低维：维度远小于节点数。
- 连续：每个元素都是实数（有大有小，有零有整）
- 稠密：每个元素都不为零。

![](https://pic.imgdb.cn/item/670c7f39d29ded1a8c9517e9.png)

还记得之前在图节点级任务中老Hi教练和Jone管理员得例子吗，我们将派系扩充至四种，通过聚类方法（无监督学习）得到不同得节点颜色，节点的颜色代表了不同的派系，节点上的数字标识了各个成员。

![](https://pic.imgdb.cn/item/670c7f27d29ded1a8c9506f2.png)

我们使用一种随机游走的算法，它可以将图中的每个节点编码为一个D维向量（embedding），在二维嵌入中，节点的位置隐式包含了图中的社群结构、连通性等信息。经过图节点嵌入后的节点向量可以用作机器学习模型的输入，以便于执行诸如节点分类、预测等任务，如下图所示。

![](https://pic.imgdb.cn/item/670c7f14d29ded1a8c94f685.png)

通过比较两张图，我们可以看到原图中相邻的节点在二维嵌入后仍然相对靠近。这表明该算法成功地将图中的结构信息保留在了低维空间中。也就是说，尽管节点被投影到了二维平面上，但它们之间的相互联系并没有被破坏。

### 编码器（Encoder）

编码器是一个函数映射，它将网络中的每个节点映射到一个D维度的向量空间。这个过程是通过随机游走生成节点序列，然后使用skip-gram模型训练得到的。

- 随机游走：在图上进行的随机移动。在每次移动时，随机游走者会从当前所在的节点随机选择一个相邻的节点作为下一个访问的目标。这个过程可以重复多次，会形成一条由访问过的节点组成的路径。这条路径被称为随机游走序列，如下图所示

![](https://pic.imgdb.cn/item/670c7f05d29ded1a8c94e770.png)

- Skip-gram模型：最大化一个节点（中心点）和它周围的节点（与中心点相邻的节点）同时出现的概率。

在定义好编码器后，我们引入一个节点相似度函数（Node Similarity Function）用于量化网络中两个节点之间的相似程度，在向量空间中计算两个节点的相似度应该尽可能地接近它们在网络中的实际相似度。
$$
\operatorname{similarity}(u, v) \approx \mathbf{z}_v^{\mathrm{T}} \mathbf{z}_u
$$

### 解码器（Decoder）

解码器的作用是将嵌入空间中的节点向量转换回原始网络中的相似度得分。最常见的做法是计算两个节点向量之间的余弦相似度。余弦相似度衡量的是两个向量之间的角度，值范围从-1到1，其中1表示完全相同，-1表示完全相反，0表示正交（不相关）。

**归纳式学习**是一种更常见和传统的机器学习方法，其目标是从已知的训练数据中学习一个模型，然后使用这个模型对新的、未见过的数据进行预测。归纳式学习的关键在于模型的泛化能力，即模型能否准确地对新数据做出预测。

**例子**：

- 使用一个标注的图像数据集来训练一个卷积神经网络（CNN），然后用这个模型对新的图像进行分类。

**直推式学习**是一种特殊的机器学习方法，其目标是在给定的训练数据和测试数据上直接进行学习，而不是学习一个通用的模型。直推式学习的目的是优化特定测试数据的性能，而不是泛化到所有未知数据。

在半监督学习中，给定一部分标注数据和大量的未标注数据，直推式学习可以直接利用这些未标注数据来改进对特定测试数据的预测性能。

# 引言

## 动机与挑战

图表示学习近年来在许多下游任务（节点分类、链接预测和社区检测）方面取得了显著进展，目前的许多方法如DeepWalk、node2vec仅针对具有单一类型节点和边的同质网络设计。然而，现实世界的应用程序，例如电子商务，远比这复杂得多，不仅包含多类型的节点和边，而且还包含丰富的属性集。由此作者提出了一种名为带属性的多层异构网络（Attribute Multi-layer Heterogeneous Network, AMHEN）的网络模型，这种模型的不同类型的节点可能与多种不同类型的边连接，并且每个节点都与一组不同的属性相关联。 虽然这种模型较为复杂，但这种情况在许多在线应用程序中很常见。

![](https://pic.imgdb.cn/item/670c7ef7d29ded1a8c94d9b4.png)

如上图所示：

- 在电子商务系统中，用户可以与商品有多种交互方式，如点击、转化、加入购物车、加入收藏夹等。显然，“用户”和“物品”有着固有的不同属性，不应被同等对待。
- 不同的用户 - 商品交互意味着不同的偏好，应得到不同的对待。否则，系统无法准确地捕捉到用户的行为模式和偏好。

由于AMHEN的复杂性，在处理时带来了一些挑战

- 每个节点对可能有多种不同的关系类型，如何从不同关系中进行有效聚合，并学习统一的嵌入表示
- 在网络数据集中，某些节点或边可能只有一小部分被观测到，由于数据的稀疏导致无法处理长尾或冷启动问题。

>***tips***
>
>长尾：一般指客户可能只与少数产品有过交互记录，导致这些客户的购买行为数据不足以全面反映其偏好或行为模式。
>
>冷启动问题：当新用户首次使用某个平台时，由于缺乏历史行为数据，推荐系统难以为其提供个性化的推荐。

## 贡献

为解决上述挑战，作者提出了一种新颖的方法来捕获丰富的属性信息，并利用来自不同节点类型的多层拓扑结构，即通用归属多层异构网络嵌入（General Attributed Multiplex HeTerogeneous Network Embedding，GATNE）。该模型已应用于阿里的推荐引擎。

# 主要方法

## 问题定义

![](https://pic.imgdb.cn/item/670c7ee2d29ded1a8c94c221.png)











