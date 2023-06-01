---
title: 使用 WPF 制作一款带高亮和过滤功能的串口工具
date: 2023-05-31 19:02:25
updated: 2023-05-31 19:02:25
cover: icon.png
tags:
    - WPF
    - C#
    - Windows APP
    - 串口
    - 日志分析
categories:
    - 经验总结
---

20 年的时候，因为信息安全和软件付费之类的原因，原本部门里面用的串口工具被集团加进了黑名单。尝试了网上可以下载到的一些小串口工具，发现要么是使用习惯不合适，要么就是日志记录功能不能满足要求，降低了组内人员的开发效率。
于是萌生了自己开发一款串口工具的想法，由于我之前有帮部门重构 WiFi 模组串口上位机的经验，我自然是完成此工作的最佳人选。加上自己对于原先的“采集日志”和“分析日志”得用两个软件这种工作模式感到非常不自然，所以花了几天的时间完成了这个软件。

写这篇文章最主要的目的是回忆我在使用 WPF 开发 Windows APP 时的一些小技巧，不会事无巨细地讲解该软件的代码，软件实现较为简单，只是业务代码的堆叠，我的实现并不能作为典型。

{% note info flat %}
项目代码在此链接：https://github.com/DovierQAQ/LogTool

开发时间较短，代码质量可能不够高，又因为我已经不从事嵌入式相关的工作了，使用该工具的频率变低。不过工具的价值是我非常认可的，所以欢迎各位参与改进代码。
{% endnote %}

![](logtool.jpg)

-------------------------------------

## 可动态调节的界面

由于软件使用时不同时间我们关注的地方不一样，让元素可以被拖拽改变大小是一个不错的主意。软件在不丢失整体性的同时也能变换成效率最高的形态。

比如在串口工具的主界面中，我们可以把主界面大致定义成两块：位于上方的“输出”部分和位于下方的“输入”部分。这两个部分的比例可以调整，这样在平时采集日志的时候可以把下方隐藏，而在分析日志时又可以让下方占比较大的比例。

从该项目来说，使用 `Grid` 标签，将整个界面网格化定义，再使用 `Grid.RowDefinitions` 定义行。

`MainWindow.xaml`
```xaml
<Grid>
    <Grid.RowDefinitions>
        <RowDefinition Height="20" />
        <RowDefinition Height="*" />
        <RowDefinition Height="3" />
        <RowDefinition Height="200" />
    </Grid.RowDefinitions>
    <Menu>
        <!-- ... -->
    </Menu>
    <DockPanel Grid.Row="1">
        <!-- ... -->
    </DockPanel>
    <GridSplitter Grid.Row="2" Height="3" HorizontalAlignment="Stretch"></GridSplitter>
    <DockPanel Grid.Row="3">
        <!-- ... -->
    </DockPanel>
</Grid>
```

可以看到我们定义了四个行：
- `<RowDefinition Height="20" />`：用来放置菜单栏
- `<RowDefinition Height="*" />`：用来放置日志显示组件，高度设置为 `*` 就可以让这个部分填满窗口空出来的部分
- `<RowDefinition Height="3" />`：分隔线的高度，分隔线就是可以用来拖拽改变布局的组件
- `<RowDefinition Height="200" />`：底下“输入”部分的高度

## 常用的对齐方式

对于界面的定义，我更倾向于用写代码的形式而不是拖拽的形式，并且会希望界面有一定的适应性，在改变窗口大小时组件也会适配窗口大小。我比较常用的是这两个组件：

- `DockPanel`
- `StackPanel`

### DockPanel

`DockPanel` 可以指定元素吸附在其中的上下左右方位，并且最后一个元素默认填满剩余空间，非常适合用来制作自适应的界面。

该项目中，底下的“输入”部分代码如下：

`MainWindow.xaml`
```xaml
<DockPanel Grid.Row="3">
    <DockPanel>
        <!-- ... -->
    </DockPanel>
    <DockPanel DockPanel.Dock="Bottom" Height="20" Margin="2">
        <!-- ... -->
    </DockPanel>
    <GroupBox Header="过滤条件">
        <!-- ... -->
    </GroupBox>
</DockPanel>
```

可以看到底下的大 `DockPanel` 包含三个子组件：
1. `<DockPanel>`：没有指明 `DockPanel.Dock` 的情况下，默认是 `Left`，这里放置的是界面左下角“串口设置”和“发送设置”的内容
2. `<DockPanel DockPanel.Dock="Bottom" Height="20" Margin="2">`：放置底部串口发送的输入框和按钮
3. `<GroupBox Header="过滤条件">`：作为最后一个元素，会填充 `DockPanel` 中剩余的空间

### StackPanel

有的时候我们的界面中会有很多“并排”的组件，比如一系列的按钮、一系列的输入框、一系列的组合框或者一系列的勾选框之类的，这一类的组件我会倾向于将它们统一设置成一样的定值宽高（使用 `style` 来定义会很方便），因为我认为这一类的东西如果大小会不受控制地改变会导致界面不够“精致”。

例如界面右下方的一系列按钮，代码如下：

`MainWindow.xaml`
```xaml
<StackPanel DockPanel.Dock="Bottom" Height="25" Orientation="Horizontal" HorizontalAlignment="Center">
    <Button x:Name="btn_read_filters" Content="导入" Width="60" Margin="5, 2" Click="btn_read_filters_Click"></Button>
    <Button x:Name="btn_save_filters" Content="导出" Width="60" Margin="5, 2" Click="btn_save_filters_Click"></Button>
    <Button x:Name="btn_add_filter" Content="添加" Width="60" Margin="5, 2" Click="btn_add_filter_Click"></Button>
    <Button x:Name="btn_show_filtered" Content="过滤" Width="60" Margin="5, 2" Click="btn_show_filtered_Click"></Button>
    <Button x:Name="btn_filter_delete" Content="删除" Width="60" Margin="5, 2" Click="btn_filter_delete_Click"></Button>
    <Button x:Name="btn_filter_clear" Content="清空" Width="60" Margin="5, 2" Click="btn_filter_clear_Click"></Button>
    <Button x:Name="btn_clear_log" Content="清屏" Width="60" Margin="5, 2" Click="btn_clear_log_Click"></Button>
</StackPanel>
```

## 数据绑定

很多时候，我们需要将后台的数据显示到界面中，这时候数据绑定就派上用场了。

我们先看代码，对于日志显示列表，代码如下：

`MainWindow.xaml`
```xaml
<DataGrid x:Name="dg_log" ItemsSource="{Binding}" IsReadOnly="True" AutoGenerateColumns="False" VerticalScrollBarVisibility="Auto" 
            HorizontalScrollBarVisibility="Auto" HeadersVisibility="None" GridLinesVisibility="None" Background="White" FontFamily="Consolas" 
            ColumnWidth="*" AllowDrop="True" Drop="dg_log_Drop" SelectionChanged="dg_log_SelectionChanged" MouseDoubleClick="dg_log_MouseDoubleClick">
    <DataGrid.Columns>
        <DataGridTemplateColumn>
            <DataGridTemplateColumn.CellTemplate>
                <DataTemplate>
                    <TextBlock Text="{Binding Text}" Foreground="{Binding Foreground}" Background="{Binding Background}" TextWrapping="Wrap"></TextBlock>
                </DataTemplate>
            </DataGridTemplateColumn.CellTemplate>
        </DataGridTemplateColumn>
    </DataGrid.Columns>
</DataGrid>
```

`MainWindow.xaml.cs - class MainWindow`
```C#
static ObservableCollection<LogItem> log_data = new ObservableCollection<LogItem>();

private void Window_Loaded(object sender, RoutedEventArgs e)
{
    dg_log.DataContext = log_data;
}
```

我们首先设置 `DataGrid` 的 `ItemsSource` 属性为 `"{Binding}"`，再在后端代码中将该组件的 `DataContext` 设置为需要显示的列表。需要注意的是，列表需使用 `ObservableCollection`，才会在列表内容发生更改时显示到前端。

指定需要显示哪个列表之后，我们需要定义每一列所需要绑定的元素。对于日志显示列表，我们希望它每一行显示一行日志，并且由于高亮系统的存在，我们希望该行的显示可以根据过滤器的设置而更改颜色，所以我们设置每一行有一个 `TextBlock`，并且设置其属性 `Text="{Binding Text}" Foreground="{Binding Foreground}" Background="{Binding Background}"`。这些 `Text`、`Foreground`、`Background` 是前面定义的列表中 `LogItem` 的成员。

`MainWindow.xaml.cs`
```C#
class LogItem
{
    public string Text { get; set; }
    public Brush Foreground { get; set; }
    public Brush Background { get; set; }

    public LogItem(string text)
    {
        Text = text;
        Foreground = Brushes.Black;
        Background = null;
    }

    public LogItem(string text, Brush fg, Brush bg)
    {
        Text = text;
        Foreground = fg;
        Background = bg;
    }
}
```

## 环境参数的处理

除了现场采集日志并实时分析的场景，有时候我们还需要使用已经采集好的日志文件进行分析，比如测试丢过来的出bug时的日志。这时候我们将日志拖拽到软件图标会是一个很方便的做法。
这件事在 WPF 中是交给 `MainApp.cs` 来完成的。

`MainApp.cs`
```C#
class MainApp
{
    [STAThread]
    public static void Main(string[] args)
    {
        if (args.Length > 0)
        {
            try
            {
                MainWindow.read_log_data(args[0]);
            }
            catch (Exception)
            {

            }
        }
        App app = new App();
        app.InitializeComponent();
        app.Run();
    }
}
```

## 参数保存

很多时候，我们需要将一些内容——比如界面布局，或者用户的一些设置——保存下来，下次运行时再读取。`ConfigurationManager` 为我们完成了这件事情，使用 k-v 的形式保存用户设置。

`MainWindow.xaml.cs - class MainWindow`
```C#
public MainWindow()
{
    InitializeComponent();

    string saved_width = ConfigurationManager.AppSettings["window_width"];
    string saved_height = ConfigurationManager.AppSettings["window_height"];
    try
    {
        Width = int.Parse(saved_width);
        Height = int.Parse(saved_height);
    }
    catch (Exception ex)
    {
        Console.WriteLine("w: " + saved_width + ", h: " + saved_height);
        Console.WriteLine("window size: " + ex.Message);
    }
}

private void Window_Loaded(object sender, RoutedEventArgs e)
{
    string saved_com = ConfigurationManager.AppSettings["selected_com"];
    string saved_baud = ConfigurationManager.AppSettings["selected_baud"];
    if (!saved_com.Equals(""))
    {
        cb_com.Text = saved_com;
    }
    if (!saved_baud.Equals(""))
    {
        cb_baud.Text = saved_baud;
    }

    log_path = ConfigurationManager.AppSettings["log_path"];
}

private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
{
    Configuration configuration = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);

    configuration.AppSettings.Settings["window_width"].Value = ActualWidth.ToString();
    configuration.AppSettings.Settings["window_height"].Value = ActualHeight.ToString();
    configuration.AppSettings.Settings["selected_com"].Value = cb_com.Text;
    configuration.AppSettings.Settings["selected_baud"].Value = cb_baud.Text;
    configuration.AppSettings.Settings["log_path"].Value = log_path;

    configuration.Save();

    Environment.Exit(0);
}
```

## 串口通信

封装成了单独的类，可以直接使用。

`GFSerial.cs`
```C#
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO.Ports;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Threading;

namespace LogTool
{
    class GFSerial
    {
        static public PortsToDisplay ports = new PortsToDisplay();
        static private DispatcherTimer timer_refresh = null;

        public Mutex recv_data_mutex = new Mutex();
        public List<byte> serial_recv_data = new List<byte>();
        public bool is_open = false;

        SerialPort serialPort = new SerialPort();
        Action recv_callback = null;
        Action close_callback = null;

        public GFSerial(Action serial_recv_callback, Action serial_close_callback = null)
        {
            recv_callback = serial_recv_callback;
            close_callback = serial_close_callback;

            serialPort.ReadTimeout = 8000;
            serialPort.WriteTimeout = 8000;
            serialPort.ReadBufferSize = 1024;
            serialPort.WriteBufferSize = 1024;
            serialPort.Parity = Parity.None;
            serialPort.DataBits = 8;
            serialPort.StopBits = StopBits.One;
            serialPort.Handshake = Handshake.None;
            // serialPort.ReceivedBytesThreshold = 1; // 每1字节触发处理函数
            serialPort.DataReceived += new SerialDataReceivedEventHandler(Serial_DataReceived);

            if (timer_refresh == null) // todo multiple serial objects
            {
                timer_refresh = new DispatcherTimer();
                timer_refresh.Interval = TimeSpan.FromMilliseconds(1000);
                timer_refresh.Tick += new EventHandler(refresh_ports_callback);
                timer_refresh.Start();
            }

            refresh_ports();
        }

        private void refresh_ports()
        {
            ports.Ports = SerialPort.GetPortNames().ToList();
        }

        private void refresh_ports_callback(object sender, EventArgs e)
        {
            if (!is_open) // todo multiple serial objects
            {
                refresh_ports();
            }
            else
            {
                if (!serialPort.IsOpen)
                {
                    is_open = false;
                    close_callback.Invoke();
                    refresh_ports();
                }
            }
        }

        private void Serial_DataReceived(object sender, SerialDataReceivedEventArgs e)
        {
            byte[] reDatas = new byte[serialPort.BytesToRead];

            serialPort.Read(reDatas, 0, reDatas.Length);

            recv_data_mutex.WaitOne();
            serial_recv_data.AddRange(reDatas);
            recv_data_mutex.ReleaseMutex();
            
            if (recv_callback != null)
            {
                recv_callback.Invoke();
            }
        }

        public bool open_serial(string com, int baud)
        {
            if (!ports.Ports.Any(e => e.StartsWith(com)))
            {
                return false;
            }

            serialPort.PortName = com;
            serialPort.BaudRate = baud;

            serialPort.Open();
            is_open = true;

            return true;
        }

        public bool close_serial()
        {
            serialPort.DiscardInBuffer();
            serialPort.DiscardOutBuffer();

            serialPort.Close();
            is_open = false;

            return true;
        }

        public bool send(byte[] data)
        {
            if (serialPort.IsOpen)
            {
                serialPort.Write(data, 0, data.Length);
                return true;
            }
            return false;
        }

        public class PortsToDisplay : INotifyPropertyChanged
        {
            private List<string> ports;
            public List<string> Ports
            {
                get { return ports; }
                set
                {
                    if (ports != value)
                    {
                        ports = value;
                        PropertyChanged(this, new PropertyChangedEventArgs("Ports"));
                    }
                }
            }
            public event PropertyChangedEventHandler PropertyChanged = delegate { };
        }
    }
}
```

## 过滤和高亮的实现

定义过滤器类：

`FilterUtils.cs`
```C#
public class Filter : INotifyPropertyChanged
{
    private bool is_enable;
    public bool Is_enable 
    { 
        get 
        { 
            return is_enable; 
        } 
        set 
        {
            if (is_enable != value)
            {
                is_enable = value;
                PropertyChanged(this, new PropertyChangedEventArgs("Is_enable"));
            }
        } 
    }
    private string state;
    public string State
    {
        get
        {
            return state;
        }
        set
        {
            if (state != value)
            {
                state = value;
                PropertyChanged(this, new PropertyChangedEventArgs("State"));
            }
        }
    }
    private string text;
    public string Text 
    { 
        get
        {
            return text;
        }
        set
        {
            if (text != value)
            {
                text = value;
                PropertyChanged(this, new PropertyChangedEventArgs("Text"));
            }
        }
    }
    private Brush foreground;
    public Brush Foreground 
    { 
        get
        {
            return foreground;
        }
        set
        {
            if (foreground != value)
            {
                foreground = value;
                PropertyChanged(this, new PropertyChangedEventArgs("Foreground"));
            }
        }
    }
    private Brush background;
    public Brush Background 
    { 
        get
        {
            return background;
        }
        set
        {
            if (background != value)
            {
                background = value;
                PropertyChanged(this, new PropertyChangedEventArgs("Background"));
            }
        }
    }
    private bool is_case_sensitive;
    public bool Is_case_sensitive 
    { 
        get
        {
            return is_case_sensitive;
        }
        set
        {
            if (is_case_sensitive != value)
            {
                is_case_sensitive = value;
                refresh_state();
                PropertyChanged(this, new PropertyChangedEventArgs("Is_case_sensitive"));
            }
        }
    }
    private bool is_regex;
    public bool Is_regex 
    { 
        get
        {
            return is_regex;
        }
        set
        {
            if (is_regex != value)
            {
                is_regex = value;
                refresh_state();
                PropertyChanged(this, new PropertyChangedEventArgs("Is_regex"));
            }
        }
    }
    private int match_count;
    public int Match_count 
    { 
        get
        {
            return match_count;
        }
        set
        {
            if (match_count != value)
            {
                match_count = value;
                PropertyChanged(this, new PropertyChangedEventArgs("Match_count"));
            }
        }
    }

    private void refresh_state()
    {
        State = "";
        if (is_case_sensitive)
        {
            State += "[Aa]";
        }
        if (is_regex)
        {
            State += "[r]";
        }
    }

    public event PropertyChangedEventHandler PropertyChanged = delegate { };
}
```

过滤器列表可以存储为 xml 文件，以便反复使用：

`FilterUtils.cs`
```C#
static public void Filter_read(ref ObservableCollection<Filter> filters)
{
    OpenFileDialog openFileDialog = new OpenFileDialog();
    openFileDialog.Title = "打开过滤器文件";
    openFileDialog.Filter = "过滤器文件|*.tat|所有文件|*.*";
    openFileDialog.FileName = string.Empty;
    openFileDialog.FilterIndex = 1;
    // openFileDialog.Multiselect = true;
    openFileDialog.RestoreDirectory = true;
    openFileDialog.DefaultExt = "tat";
    if (openFileDialog.ShowDialog() == false)
    {
        return;
    }

    string filter_file = openFileDialog.FileName;

    XmlDocument xmlDoc = new XmlDocument();
    try
    {
        xmlDoc.Load(filter_file);
    }
    catch (Exception)
    {
        MessageBox.Show("xml文件无效");
        return;
    }
    XmlNode xn;
    xn = xmlDoc.SelectSingleNode("TextAnalysisTool.NET");
    if (xn == null)
    {
        xn = xmlDoc.SelectSingleNode("GuoFanLogTool");
        if (xn == null)
        {
            MessageBox.Show("文件格式错误");
            return;
        }
    }
    try
    {
        xn = xn.SelectSingleNode("filters");
        XmlNodeList xnlNL = xn.SelectNodes("filter");
        foreach (XmlNode xnl in xnlNL)
        {
            XmlElement xe = (XmlElement)xnl;
            Filter item = new Filter();

            item.Foreground = Brushes.Black;
            item.Background = null;

            item.Is_enable = xe.GetAttribute("enabled").ToString().Equals("y");
            item.Text = xe.GetAttribute("text").ToString();
            if (xe.HasAttribute("foreColor"))
            {
                item.Foreground = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#" + xe.GetAttribute("foreColor").ToString()));
            }
            if (xe.HasAttribute("backColor"))
            {
                item.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#" + xe.GetAttribute("backColor").ToString()));
            }
            item.Is_case_sensitive = xe.GetAttribute("case_sensitive").ToString().Equals("y");
            item.Is_regex = xe.GetAttribute("regex").ToString().Equals("y");

            bool is_match = false;
            foreach (var filter in filters)
            {
                if (filter.Is_case_sensitive == item.Is_case_sensitive && filter.Is_regex == item.Is_regex && filter.Text.Equals(item.Text))
                {
                    is_match = true;
                    break;
                }
            }
            if (!is_match)
            {
                filters.Add(item);
            }
        }
    }
    catch (Exception)
    {
        MessageBox.Show("过滤器文件损坏");
        return;
    }
}

static public void Filter_save(ref ObservableCollection<Filter> filters)
{
    SaveFileDialog saveFileDialog = new SaveFileDialog();
    saveFileDialog.Title = "选择过滤器文件位置";
    saveFileDialog.Filter = "过滤器文件|*.tat|所有文件|*.*";
    saveFileDialog.FileName = "filter";
    saveFileDialog.FilterIndex = 1;
    saveFileDialog.RestoreDirectory = true;
    saveFileDialog.DefaultExt = "tat";
    if (saveFileDialog.ShowDialog() == false)
    {
        return;
    }

    string file_path = saveFileDialog.FileName;

    XmlDocument xmlDoc = new XmlDocument();
    xmlDoc.AppendChild(xmlDoc.CreateXmlDeclaration("1.0", "utf-8", null));
    XmlElement root = xmlDoc.CreateElement("GuoFanLogTool");
    root.SetAttribute("version", "1.0");
    xmlDoc.AppendChild(root);
    XmlElement filter_list = xmlDoc.CreateElement("filters");
    root.AppendChild(filter_list);

    foreach (var filter in filters)
    {
        XmlElement filter_xml = xmlDoc.CreateElement("filter");
        filter_xml.SetAttribute("enabled", filter.Is_enable ? "y" : "n");
        filter_xml.SetAttribute("case_sensitive", filter.Is_case_sensitive ? "y" : "n");
        filter_xml.SetAttribute("regex", filter.Is_regex ? "y" : "n");
        filter_xml.SetAttribute("foreColor", filter.Foreground.ToString().Replace("#", ""));
        filter_xml.SetAttribute("backColor", filter.Background.ToString().Replace("#", ""));
        filter_xml.SetAttribute("text", filter.Text);
        filter_list.AppendChild(filter_xml);
    }

    xmlDoc.Save(file_path);
}
```

## 自定义组件

在添加过滤器时，我们希望有一个组合框可以用来选颜色，但没有现成的组件，所以需要创造它。

![](filter.png)

`ColorCombobx.xaml`
```C#
<UserControl x:Class="LogTool.ColorCombobx"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" 
             xmlns:d="http://schemas.microsoft.com/expression/blend/2008" 
             xmlns:local="clr-namespace:LogTool"
             mc:Ignorable="d" 
             d:DesignHeight="20" d:DesignWidth="60">
    <Grid>
        <ComboBox x:Name="cb_color" SelectionChanged="cb_color_SelectionChanged">
            <ComboBox.ItemTemplate>
                <DataTemplate>
                    <StackPanel Orientation="Horizontal">
                        <Rectangle Fill="{Binding Name}" Height="15" Width="25"></Rectangle>
                        <TextBlock Text="{Binding Name}" Margin="5,0,0,0"></TextBlock>
                    </StackPanel>
                </DataTemplate>
            </ComboBox.ItemTemplate>
        </ComboBox>
    </Grid>
</UserControl>
```

`ColorCombobx.xaml.cs`
```C#
using System.Reflection;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace LogTool
{
    /// <summary>
    /// ColorCombobx.xaml 的交互逻辑
    /// </summary>
    public partial class ColorCombobx : UserControl
    {
        public ColorCombobx()
        {
            InitializeComponent();

            cb_color.ItemsSource = typeof(Colors).GetProperties();
        }

        public static readonly DependencyProperty SelectedColorProperty = DependencyProperty.Register(nameof(SelectedColor), 
            typeof(Color?), typeof(ColorCombobx), new FrameworkPropertyMetadata(null, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault, OnSelectedColorChanged));
        public Color? SelectedColor
        {
            get
            {
                return (Color?)GetValue(SelectedColorProperty);
            }
            set
            {
                SetValue(SelectedColorProperty, value);
                if (cb_color.Items.Count > 0)
                {
                    foreach (PropertyInfo color_property in cb_color.Items)
                    {
                        if (((Color)ColorConverter.ConvertFromString(color_property.Name)).Equals(value))
                        {
                            cb_color.SelectedItem = color_property;
                        }
                    }
                }
            }
        }

        private static void OnSelectedColorChanged(DependencyObject o, DependencyPropertyChangedEventArgs e)
        {
            ColorCombobx cc = o as ColorCombobx;
            if (cc != null)
            {
                cc.OnSelectedColorChanged((Color?)e.OldValue, (Color?)e.NewValue);
            }
        }

        protected virtual void OnSelectedColorChanged(Color? oldValue, Color? newValue)
        {
            var args = new RoutedPropertyChangedEventArgs<Color?>(oldValue, newValue);
            args.RoutedEvent = SelectedColorChangedEvent;
            RaiseEvent(args);
        }

        public static readonly RoutedEvent SelectedColorChangedEvent = EventManager.RegisterRoutedEvent(nameof(SelectedColorChanged),
            RoutingStrategy.Bubble, typeof(RoutedPropertyChangedEventHandler<Color?>), typeof(ColorCombobx));
        public event RoutedPropertyChangedEventHandler<Color?> SelectedColorChanged
        {
            add
            {
                AddHandler(SelectedColorChangedEvent, value);
            }
            remove
            {
                RemoveHandler(SelectedColorChangedEvent, value);
            }
        }

        private void UpdateSelectedColor(Color? color)
        {
            SelectedColor = ((color != null) && color.HasValue)
                            ? (Color?)Color.FromArgb(color.Value.A, color.Value.R, color.Value.G, color.Value.B)
                            : null;
        }

        private void cb_color_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var color_property = (PropertyInfo)cb_color.SelectedItem;
            UpdateSelectedColor((Color)ColorConverter.ConvertFromString(color_property.Name));
        }
    }
}
```
