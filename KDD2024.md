# KDD 2024: Harvesting Efficient On-Demand Order Pooling from Skilled Couriers: Enhancing Graph Representation Learning for Refining Real-time Many-to-One Assignments

原文链接：[Harvesting Efficient On-Demand Order Pooling from Skilled Couriers: Enhancing Graph Representation Learning for Refining Real-time Many-to-One Assignments (arxiv.org)](https://arxiv.org/pdf/2406.14635)

# 摘要

The recent past has witnessed a notable surge in on-demand food delivery(OFD) services, offering delivery fulfillment within dozens of minutes after an order is placed. In OFD, pooling multiple or-ders for simultaneous delivery in real-time order assignment is a pivotal efficiency source, which may in turn extend delivery time. Constructing high-quality order pooling to harmonize platform ef-ficiency with the experiences of consumers and couriers, is crucial to OFD platforms. However, the complexity and real-time nature of order assignment, making extensive calculations impractical, signif-icantly limit the potential for order consolidation. Moreover, offilne environment is frequently riddled with unknown factors, posing challenges for the platform’s perceptibility and pooling decisions.

Nevertheless, delivery behaviors of skilled couriers(SCs) who know the environment well, can improve system awareness and effectively inform decisions. Hence a SC delivery network(SCDN) is constructed, based on an enhanced attributed heterogeneous network embedding approach tailored for OFD. It aims to extract features from rich temporal and spatial information, and uncover the latent potential for order combinations embedded within SC trajectories. Accordingly, the vast search space of order assignment can be effectively pruned through scalable similarity calculations of low-dimensional vectors, making comprehensive and high-quality pooling outcomes more easily identified in real time. In addition, the acquired embedding outcomes highlight promising subspaces embedded within this space, i.e., scale-effect hotspot areas, which can offer significant potential for elevating courier efficiency.

SCDN has now been deployed in Meituan dispatch system. On-line tests reveal that with SCDN, the pooling quality and extent have been greatly improved. And our system can boost couriers’ efficiency by 45-55% during noon peak hours, while upholding the timely delivery commitment.

# 1 引言

## 1.1问题与挑战

### 巨大的实时计算复杂度

按需食品配送（On-demand food，下文简称OFD）的关键效率来源是将多个订单合并为单个快递员的同步配送，即解决多目标订单到一个配送员的分配问题（MOA）。作者据此提出了一个评价指标（matching degree，MD），通过评估MD的分数来预测订单与快递员之间的匹配程度，MD是一个综合优化目标，包括包括路线便利性、超时风险和骑手接受意愿。这个评价指标需要大量的计算来模拟骑手在接受订单后的取送路线规划（pick-up and delivery route planning，PDRP），这产生了巨大的实时计算复杂度。具体阐述如下

- 基于PDRP结果的MD评分是不可加的，即同时分配多个订单给快递员的MD评分并不等于单独为每个订单分配给同一快递员的MD评分之和，这变成了一个组合问题，假设最多有5个订单分配给一个快递员，每个订单（组合）的平均候选快递员数量是100，则计算量是$\left(C_{3000}^1+C_{3000}^2+C_{3000}^3+C_{3000}^4+C_{3000}^5\right) \times 100$，这会导致组合爆炸
- MOA问题本身被分类为一个NP困难的整数规划问题，因其搜索空间极其庞大而闻名。

由于以上问题，目前平台暂时采取的方法依然是每个订单进行一对一的分配（即一个订单对应一名快递员）

### 最后一公里线下环境的复杂性

“最后一公里”的线下环境非常复杂且动态变化，包括无法预见的道路关闭、未知的自然障碍以及临时出现的各种情况。粗略数据和有限意识做出的订单合并决策可能不合理，从而损害快递员体验，导致配送延迟，并降低配送效率。

## 1.2动机与贡献

### 动机

- 作者认为熟练的快递员（Skilled courier，SC）通常对线下环境线下环境有全面的了解，利用其专业知识优化路线，减少绕路和加班时间。平台通过应用程序收集快递员的取货和送货地点偏好，促进更高效的运营。因此，SC的行为选择、路线顺序和反馈可提供更好的基于快递员的聚合结果，并有助于提高决策质量。

### 贡献

提出了一种系统解决方案框架SC交付网络（SCDN），这是首次将图表示学习用于OFD的实时订单优化，

- 构建了一个图模型AMHEN
- 基于GATNE定制了一个EATNE算法

# 2 图表示学习方法

## 2.1预备知识

### 流动单元（Flow Unit，FU）

FU是构建配送网络中的基本单元，是从一个取货区域（Area of Interest, AOI）到另一个交付区域（AOI）的一组订单的集合。这些订单共享相同的取货AOI和交付AOI。同一个FU中的订单具有相同的起点和终点。举个例子，一年级每个班的同学们集体订购了蜜雪冰城的冰激凌，所有班的订单集合就是一个流动单元，它们拥有相同的起点和终点。

###  带属性的多层异构网络（AMHEN）

带属性的多层异构网络（Attribute Multi-layer Heterogeneous Network, AMHEN）是一种复杂的网络模型，它包括以下内容

- 节点：不同的节点类型，如取货点、配送中心、客户等，不同的节点拥有不同的属性。
- 链接：不同的链接类型，如取件链接、派件链接等，同样拥有不同的属性。
- 层：不同的网络层，如取件层、派件层等。

### GATNE

GATNE（Graph Attention Network with Edge Features）是一种专门设计用于处理包含多种边类型的图数据的图神经网络模型。通过GATNE，我们可以生成每个节点的向量表示（FU嵌入），这些向量不仅包含了节点的属性信息，还包含了其在网络中的拓扑位置信息。

![](https://pic.imgdb.cn/item/67062608d29ded1a8c6f680a.png) 

算法流程

![](https://pic.imgdb.cn/item/6706261ad29ded1a8c6f7635.png)

## 2.2 AMHEN架构

作者设定了两种FU序列：一种基于取货行为，另一种基于送货行为，由图4我们可以发现，多样化的快递员FU序列可能包含一些共同的FU。作者将FU作为节点，并将其序列中的连接视为链接。将所有FU序列整合到一个统一但异构的图中。

![](https://pic.imgdb.cn/item/67062629d29ded1a8c6f8442.png)

设定好AMHEN结构后，下面我们将AMHEN结构抽象成一个图模型，定义如下：

![](https://pic.imgdb.cn/item/67062637d29ded1a8c6f8e7e.png)

- $G=(V,E,A)$，其中$V$表示FU节点集、$E$表示边集、$A$表示所有节点的属性集。

- FU中的节点$v_{i}$属于$V$集合，每个FU节点$v_{i}$都有一个属性集$x_{i} \in A$，用于描述其关键特征，如地理位置、容量、处理时间等。
- $E$集合包含了两种类型的边，即取件边（pick-up edges）和送货边（delivery edges）。下面详细解释以下这两条边

取件边：当一个订单从FU中的$v_{i}$被取走后，紧接着下一个订单从FU中的$v_{j}$也被同一辆配送车取走时，就会形成一条取件边$e_{ij}^{p}$连接$v_{i}$和$vj$。这条边反映了配送车在取件过程中的路径。送货边同理，此处不再赘述。

- $A$集合包含了所有FU节点的属性，如地理位置、容量、处理时间等。

## 2.3图表示学习模型

作者根据将AMHEN作为输入，应用GATNE模型来生成节点向量表示，具体步骤如下所示：

![](https://pic.imgdb.cn/item/67062642d29ded1a8c6f9782.png)

在GATNE中，节点嵌入被分解为两个部分：基嵌入（Base Embedding）和边嵌入（Edge Embedding）。

每个节点的基嵌入$ b_i  $是其属性$  x_i  $的参数化函数：$ b_i = h(x_i) $

- $x_i$：节点 $v_i $的属性集。
- $h$：一个激活函数，通常是ReLu或其他非线性变换函数。

边嵌入虽然名字是Edge Embedding，但并不是对边的Embedding，而是基于不同边类型下对节点特征的聚合

- 1.**初始边嵌入**

初始边嵌入 $u_{i, \tau}^{(0)}$ 参数化为节点属性 $x_i$ 的函数:
$$
u_{i, \tau}^{(0)}=g_\tau\left(x_i\right)
$$
$g_\tau$ : 一个变换函数，用于将节点属性转换为初始边嵌入。注意此时的 $u_{i, \tau}^{(0)}$ 是随机初始化的

- 2.**计算并聚合邻居信息**

$$
\mathbf{u}_{i, \tau}^{(k)}= aggregator \left(\left\{\mathbf{u}_{j, \tau}^{(k-1)}, \forall v_j \in \mathcal{N}_{i, \tau}\right\}\right)
$$

${u}_{i, \tau}^{(k)}$表示节点$v_{i}$在边类型$\tau$上的第K层嵌入，它表示着节点嵌入的组合，将它展开可表示成：

在某层上节点 $v_i$ 的取货边嵌入 $u_i^p$ 和送货边嵌入 $u_i^d$ 组合的一个向量：$U_i=\left[u_i^p, u_i^d\right]$

$N_{i, \tau}$ ：节点 $v_i$ 在边类型 $\tau$ 上的邻居集合。

$aggregator(\cdot)$表示聚合函数，可以是sum，max等，本文作者采用mean操作作为聚合函数

- 3.**引入注意力机制**

![](https://pic.imgdb.cn/item/6706264ed29ded1a8c6fa2d4.png)

由于取货边和送货边对节点的影响不同，重要程度实际上也是不同的，所以作者也采用了注意力机制：通过self-attention可以让节点关注到对其影响更加大的类型连接的节点特征。
$$
\mathbf{a}_{i, \tau}=\operatorname{softmax}\left(\mathbf{w}_\tau^{\top} \tanh \left(\mathbf{W}_\tau \mathbf{U}_i\right)\right)^{\top},
$$

- 4.**更新嵌入计算**

![](https://pic.imgdb.cn/item/67062659d29ded1a8c6faed3.png)

- 节点 $i$ 的原始特征 $x_i$ 经过非线性变换 $h(\cdot)$ 得到的输出。
- 注意力机制下的局部信息传播，即节点 $i$ 到其父节点 $p$ 的边的嵌入 $u_{i, p}$ 乘以转换矩阵 $M_p$ ，并用注意力系数 $a_{i, p}$ 加权。
- 全局信息传播，即将节点 $i$ 的特征 $x_i$ 乘以全局归一化常数 $g_p$ 。

![](https://pic.imgdb.cn/item/67062668d29ded1a8c6fbd8c.png)

未完待续









